import React, { Component } from 'react';

import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import qs from 'simple-query-string';
import { Tabs, Tab } from 'react-bootstrap-tabs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

import {
    getSubscriptionPlan,
    billingResult,
    updateDefaultBillingForWeb,
    getBillingData,
    getAllBillingWithPagination,
    getCountries,
    updateCustomer,
    getCustomerById,
    insertUserForSubscription
} from '../../../api/commonApi';

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

class Billing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLength: false,
            subscriptionPlans: [],
            planOne: 'card-body active',
            planTwo: 'card-body',
            subsData: [],
            pageNumber: 1,
            billingWithPlanDetailsLastData: [],
            receiptData: [],
            totalDataArray: [],
            receiptHidden: false,
            pdfHidden: true,
            dataValArray: [],
            dataArrayOne: [],
            billingWithPlanDetailsLastDataOne: [],
            selected: 0,
            recieptMonth: '',
            receiptYear: '',
            companyName: '',
            country: '',
            companyAddress: '',
            zip: '',
            countryList: [],
            countryName: 'Select Country',
            billingPlanType: 'Monthly',
            allBillval: []
        };

        let currentPlanName;
        let planDetails = [];
        let billingDetails = [];

        // getting query params value for payment
        if (this.props && this.props.onHistory.location && this.props.onHistory.location.search) {
            const parsed = qs.parse(this.props.onHistory.location.search);
            if (localStorage.getItem("currentPlanName")) {
                currentPlanName = JSON.parse(localStorage.getItem("currentPlanName"));
            }
            if (parsed) {

                console.log("parse data :", parsed);

                let expiryDate = new Date(new Date().setDate(new Date().getDate() + parseInt(parsed["thrivecart[order][0][q]"])));
                if (parsed.userId) {
                    const data = {
                        account_id: parsed["thrivecart[account_id]"],
                        account_name: parsed["thrivecart[account_name]"],
                        country: parsed["thrivecart[customer][address][country]"],
                        zipCode: parsed["thrivecart[customer][address][zip]"],
                        email: parsed["thrivecart[customer][email]"],
                        firstName: parsed["thrivecart[customer][firstname]"],
                        lastName: parsed["thrivecart[customer][lastname]"],
                        id: parsed["thrivecart[order][0][id]"],
                        amount: parsed["thrivecart[order][0][p]"],
                        planType: parsed["thrivecart[order][0][n]"],
                        currencyType: parsed["thrivecart[order_currency]"],
                        order_id: parsed["thrivecart[order_id]"],
                        payment_processor: parsed["thrivecart[payment_processor]"],
                        thrivecart_hash: parsed.thrivecart_hash,
                        userId: parsed.userId,
                        billingDate: new Date(),
                        expiryDate: expiryDate
                    };


                    planDetails.push(currentPlanName);
                    billingDetails.push(data);

                    const dataNew = {
                        planDetails: planDetails,
                        billingDetails: billingDetails,
                        userId: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
                        _id: JSON.parse(localStorage.getItem("billingIdWitDetails"))._id,
                        order_id: data.order_id
                    };


                    updateDefaultBillingForWeb(dataNew).then((res) => {
                        if (res.data.success == true) {
                            this.props.onHistory.push({ pathname: "/billing" });
                        }
                    }).catch((error) => {

                    });
                }
                else {
                    const forSubscription = {
                        email: parsed["thrivecart[customer][email]"],
                        first_name: parsed["thrivecart[customer][firstname]"],
                        last_name: parsed["thrivecart[customer][lastname]"],
                        order_id: parsed["thrivecart[order_id]"]
                    };
                    insertUserForSubscription(forSubscription).then((res) => {
                        NotificationManager.success('Successfully subscribed.', "Success");
                        if (res.data.status == true) {
                            localStorage.setItem("newSubscription", forSubscription.email);

                            this.props.onHistory.push({
                                pathname: "/setpassword"
                            });
                        }
                        else if (res.data.success == true) {
                            localStorage.removeItem("catchLetterDetails");
                            this.props.onHistory.push({
                                pathname: "/"
                            });
                        }
                    })
                }

            }

        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let planDetails = [];
        let allBillval = [];
        let value;

        if (localStorage.getItem("catchLetterDetails")) {
            value = JSON.parse(localStorage.getItem("catchLetterDetails"));
            const dataBilling = {
                userId: value._id
            };

            getBillingData(dataBilling).then((res) => {
                if (res.data.success == true) {
                    localStorage.setItem("billingIdWitDetails", JSON.stringify(res.data.data.details[0]));
                    this.setState({
                        totalDataArray: res.data.data.details[0].details
                    });
                }
            }).catch((error) => {

            });

            getSubscriptionPlan().then((res) => {
                if (res.data.success == true) {
                    res.data.data.subscriptionData.map((result3) => {
                        if (result3.subs_type != "Free") {
                            allBillval.push(result3);
                            if (result3.subs_duration == this.state.billingPlanType) {
                                planDetails.push(result3);
                            }
                        }
                    });
                    this.setState({
                        isLength: true
                    });
                    this.setState({
                        subscriptionPlans: planDetails,
                        allBillval: allBillval
                    });
                } else {
                    this.setState({
                        subscriptionPlans: []
                    });
                }
            }).catch((error) => {
                this.setState({
                    isLength: true
                });
                this.setState({
                    subscriptionPlans: []
                });
            });

            const data = {
                userId: value._id,
                page: this.state.pageNumber
            };

            getAllBillingWithPagination(data).then((res) => {
                let dataArray = [];
                let lastData = [];
                let billing_details = [];
                let valdata;
                if (res.data.success == true) {

                    res.data.data.subscriptionData.map((res1) => {
                        if (res1.details.length != 0) {

                            if (res1.details[0].planDetails.map((res7) => {
                                if (res7.subs_type == "Free") {
                                    lastData = [];
                                    dataArray = [];
                                } else {

                                    let dataOne = res1.details[0];
                                    lastData.push(dataOne);

                                    for (let i = 0; i < res1.details.length; i++) {
                                        for (let j = 0; j < res1.details[i].planDetails.length != 0; j++) {
                                            if (res1.details[i].planDetails[j].subs_type != "Free") {
                                                dataArray.push({
                                                    orderId: res1.details[i].billingDetails[0].order_id,
                                                    orderDate: res1.details[i].billingDetails[0].billingDate,
                                                    amount: res1.details[i].billingDetails[0].amount
                                                });
                                            }
                                        }
                                    }
                                }
                            }));
                        }
                    });
                    this.setState({
                        receiptData: dataArray,
                        dataArrayOne: dataArray,
                        billingWithPlanDetailsLastData: lastData,
                        billingWithPlanDetailsLastDataOne: lastData,
                        isLength: true
                    });
                }
            }).catch((error) => {
                this.setState({
                    isLength: true
                });
            });

            // getting countries
            getCountries().then((res) => {
                if (res.data.length != 0) {
                    this.setState({
                        countryList: res.data
                    });
                }
            }).catch((error) => {

            });

            // get user information
            getCustomerById(value._id).then((res) => {
                if (res.data.success == true) {
                    this.setState({
                        companyName: res.data.data.userDetails.company ? res.data.data.userDetails.company : '',
                        countryName: res.data.data.userDetails.country ? res.data.data.userDetails.country : 'Select Country',
                        companyAddress: res.data.data.userDetails.company_address ? res.data.data.userDetails.company_address : '',
                        zip: res.data.data.userDetails.company_zip ? res.data.data.userDetails.company_zip : ''
                    });
                }
            }).catch((error) => {

            });
        } else {
            this.props.onHistory.push({ pathname: '/' });
        }

    }

    /** save value to state */
    handleChange(event) {
        var change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
    }

    /** set planType */
    setPlanType(event) {
        let dataval = [];
        if (event.target.value == "Monthly") {
            if (this.state.allBillval.length != 0) {
                this.state.allBillval.map((res1) => {
                    if (res1.subs_duration == "Monthly") {
                        dataval.push(res1);
                        this.setState({
                            subscriptionPlans: dataval,
                            billingPlanType: "Monthly"
                        });
                    }
                });
            }
        } else if (event.target.value == "Yearly") {
            if (this.state.allBillval.length != 0) {
                this.state.allBillval.map((res1) => {
                    if (res1.subs_duration == "Yearly") {
                        dataval.push(res1);
                        this.setState({
                            subscriptionPlans: dataval,
                            billingPlanType: "Yearly"
                        });
                    }
                });
            }
        }
    }

    // show current plan name
    currentPlanName(value) {
        if (value) {
            localStorage.setItem("currentPlanName", JSON.stringify(value));
        }
    }

    // display Subscription plans
    displaySubscriptionPlans() {
        if (this.state.subscriptionPlans.length != 0) {
            return this.state.subscriptionPlans.map((res, index) => (

                <div className="col-md-4 mb-2" key={index}>
                    <form action={res.subs_url} method="get">
                        <div className="card shadow subscription-box">
                            <div className={this.state.planOne}>
                                <h5 className="text-center">{res.subs_name}</h5><h3 className="text-center" onClick={() => this.displayPlanOne(res)}>${res.subs_price} / {res.subs_duration}</h3>

                                {ReactHtmlParser(res.subs_desc)}

                            </div>
                            <div className="card-footer clearfix">
                                <input type="hidden" name="passthrough[userId]" value={JSON.parse(localStorage.getItem("catchLetterDetails"))._id} />
                                < input className="btn btn-primary text-uppercase rounded-0 m-auto d-block"
                                    type="submit"
                                    value="Subscription" />
                                {/* <a href={res.subs_url} target="_self" onClick={() => this.currentPlanName(res)} className="text-center d-block">Subscription</a> */}
                            </div>
                        </div>
                    </form>
                </div>

            ));
        } else if (this.state.isLength == false) {
            return <div className="p-4"><h3>Loading...</h3></div>
        }
        else {
            return (
                <div className="p-4">No content found.</div>
            )
        }
    }

    // displayPlan
    displayPlanOne(data) {
        let array = [];
        array.push(data);
        if (data) {
            this.setState({
                subsData: array
            });
        }
    }

    // display subscription plan
    displaySubscriptionPlan(data) {
        if (this.state.subsData.length != 0) {
            return this.state.subsData.map((res1, index) => (
                <div className="col-md-6" key={index}>
                    <h4>Your subscription</h4>
                    <ul>
                        <li><b>Plan:</b> <span>{res1.subs_name}</span></li>
                        <li><b>Cost:</b> <span>${res1.subs_price} / {res1.subs_duration}</span></li>
                        {/* <li><b>Status:</b> <span>In trial - <a href>Close account</a></span></li> */}
                    </ul>
                </div>
            ));
        }
    }

    //display all details
    displayAllDetails() {
        if (this.state.receiptData.length != 0) {
            return this.state.receiptData.map((result2, index) => (
                <tr key={index}>
                    <td><a href="javascript:void(0)" onClick={() => this.goPdf(result2)}>#{result2.orderId}</a></td>
                    <td>{new Date(result2.orderDate).getDate() + "/" + new Date(result2.orderDate).getMonth() + "/" + new Date(result2.orderDate).getFullYear()}</td>
                    <td>${result2.amount}</td>
                </tr>
            ));
        } else if (this.state.isLength == false) {
            return <div className="p-4"><h3>Loading...</h3></div>
        }
        else {
            return (
                <div>No content found.</div>
            )
        }
    }

    // display last plan
    displayPlan() {
        if (this.state.billingWithPlanDetailsLastData.length != 0) {
            return this.state.billingWithPlanDetailsLastData.map((result1, index) => (
                <div className="card shadow p-4 package-info-box" key={index}>
                    <ul className="list-unstyled">
                        <li>
                            <p>Package Neme :</p><p><b>{result1.planDetails[0].subs_name}</b></p>
                        </li>
                        <li>
                            <p>Package Price :</p><p><a>${result1.planDetails[0].subs_price}</a></p>
                        </li>
                        {
                            result1 && (Math.ceil(Math.abs(new Date(result1.billingDetails[0].expiryDate).getTime()) - (new Date(result1.billingDetails[0].billingDate).getTime())) / (1000 * 3600 * 24)).toFixed(0) > 380 ?

                                <li>
                                    <p>Package Validity :</p><p><strong>Life-Time</strong></p>
                                </li>


                                :
                                <div>
                                    <li>
                                        <p>Package Validity :</p><p><strong>{(Math.ceil(Math.abs(new Date(result1.billingDetails[0].expiryDate).getTime()) - (new Date(result1.billingDetails[0].billingDate).getTime())) / (1000 * 3600 * 24)).toFixed(0)} Days</strong></p>
                                    </li>
                                    <li>
                                        <p>Expiry Date :</p><p><strong>{new Date(result1.billingDetails[0].expiryDate).getDate() + " " + monthNames[new Date(result1.billingDetails[0].expiryDate).getMonth()] + ", " + new Date(result1.billingDetails[0].expiryDate).getFullYear()}</strong></p>
                                    </li>
                                </div>
                        }
                        {/* <li>
                            <p>Package Validity :</p><p><strong>{(Math.ceil(Math.abs(new Date(result1.billingDetails[0].expiryDate).getTime()) - (new Date(result1.billingDetails[0].billingDate).getTime())) / (1000 * 3600 * 24)).toFixed(0)} Days</strong></p>
                        </li>
                        <li>
                            <p>Expiry Date :</p><p><strong>{new Date(result1.billingDetails[0].expiryDate).getDate() + " " + monthNames[new Date(result1.billingDetails[0].expiryDate).getMonth()] + ", " + new Date(result1.billingDetails[0].expiryDate).getFullYear()}</strong></p>
                        </li> */}
                        <li>
                            <p>Package Information :</p>
                            <div style={{ width: "calc(100% - 180px)", float: 'left' }}>
                                {ReactHtmlParser(result1.planDetails[0].subs_desc)}
                            </div>
                        </li>
                    </ul>
                </div>
            ));
        } else if (this.state.isLength == false) {
            return <div className="p-4"><h3>Loading...</h3></div>
        }
        else {
            return (
                <div className="p-4">No content found.</div>
            )
        }
    }

    goPdf(value) {
        let dataVal;
        let dataValArray = [];
        if (this.state.totalDataArray.length != 0) {
            this.state.totalDataArray.map((res) => {
                if (res.billingDetails[0].order_id == value.orderId) {
                    dataVal = res;
                }
            });
            let recieptMonth = monthNames[new Date(dataVal.billingDetails[0].billingDate).getMonth()];
            let receiptYear = new Date(dataVal.billingDetails[0].billingDate).getFullYear();
            dataValArray.push(dataVal);
            this.setState({
                dataValArray: dataValArray,
                receiptHidden: true,
                pdfHidden: false,
                selected: 1,
                recieptMonth: recieptMonth,
                receiptYear: receiptYear
            });
        }
    }

    showPdfBilling() {
        if (localStorage.getItem("catchLetterDetails")) {
            if (this.state.dataValArray.length != 0) {
                return this.state.dataValArray.map((res, index) => (

                    <div id="testContainer" key={index} style={{ width: '794px', height: 'auto', margin: 'auto', fontFamily: 'arial', padding: '15px' }}>
                        <h1 style={{ fontFamily: 'arial', fontWeight: 'bold', fontSize: '28px', display: 'block', textAlign: 'center', borderBottom: '1px solid #ddd', paddingBottom: '15px', paddingTop: '30px' }} >Receipt for {monthNames[new Date(res.billingDetails[0].billingDate).getMonth()]} {new Date(res.billingDetails[0].billingDate).getFullYear()}</h1>

                        <ul style={{ padding: '0px', listStyle: 'none', color: '#5c5a5a', fontSize: '14px', lineHeight: '20px', marginTop: '20px' }}>
                            <li><h3 style={{ fontSize: '20px', marginBottom: '5px', fontWeight: 'bold' }} >Customer Information</h3></li>
                            <li>{JSON.parse(localStorage.getItem("catchLetterDetails")).first_name + " " + JSON.parse(localStorage.getItem("catchLetterDetails")).last_name}</li>
                            <li>{this.state.companyName}</li>

                            <li>{this.state.companyAddress}</li>
                            <li>{this.state.countryName != "Select Country" ? this.state.countryName : ''}</li>
                            <li>{this.state.zip}</li>
                            {/* <li>6 East Pleasant Court Hyde Park, MA 02136 , US</li> */}
                            <li>{JSON.parse(localStorage.getItem("catchLetterDetails")).phone}</li>
                            <li></li>
                        </ul>
                        <table width="100%" style={{ border: '1px solid #ddd', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <tr style={{ borderBottom: '1px solid #ddd', color: '#5c5a5a', fontSize: '16px' }}>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Description</th>
                                <th style={{ textAlign: 'center', padding: 10 }}>Date</th>
                                <th style={{ textAlign: 'right', padding: '10px' }}>Amount</th>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ddd', color: '#5c5a5a', fontSize: '14px' }}>
                                <td style={{ textAlign: 'left', padding: '10px' }}>{res.billingDetails[0].planType}</td>


                                {/* <td style={{ textAlign: 'center', padding: '10px' }}>{new Date(res.billingDetails[0].billingDate).getDate() + "/" + new Date(res.billingDetails[0].billingDate).getMonth() + "/" + new Date(res.billingDetails[0].billingDate).getFullYear()}</td> */}
                                <td style={{ textAlign: 'center', padding: '10px' }}>{new Date(res.billingDetails[0].billingDate).getDate() + " " + monthNames[new Date(res.billingDetails[0].billingDate).getMonth()] + ", " + new Date(res.billingDetails[0].billingDate).getFullYear()}</td>
                                <td style={{ textAlign: 'right', padding: '10px' }}>${res.billingDetails[0].amount}</td>
                            </tr>
                            {/* <tr style={{ borderBottom: '1px solid #ddd', color: '#5c5a5a', fontSize: '14px' }}>
                                <td style={{ textAlign: 'left', padding: '10px' }}>Specifies the alignment of a table according to surrounding text</td>
                                <td style={{ textAlign: 'center', padding: '10px' }}>12 july 2018</td>
                                <td style={{ textAlign: 'right', padding: '10px' }}>$50</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ddd', color: '#5c5a5a', fontSize: '14px' }}>
                                <td style={{ textAlign: 'left', padding: '10px' }}>Specifies the alignment of a table according to surrounding text</td>
                                <td style={{ textAlign: 'center', padding: '10px' }}>12 july 2018</td>
                                <td style={{ textAlign: 'right', padding: '10px' }}>$50</td>
                            </tr> */}
                            <tr style={{ borderBottom: '1px solid #ddd', color: '#5c5a5a', fontSize: '14px', backgroundColor: '#f2f4f4', fontWeight: '600' }}>
                                <td colSpan="2" style={{ textAlign: 'left', padding: '10px' }}>Sub Total</td>
                                <td style={{ textAlign: 'right', padding: '10px' }}>${res.billingDetails[0].amount}</td>
                            </tr>
                            {/* <tr style={{ borderBottom: '1px solid #ddd', color: '#5c5a5a', fontSize: '14px', backgroundColor: '#f2f4f4', fontWeight: '600' }}>
                                <td colSpan="2" style={{ textAlign: 'left', padding: '10px' }}>Discount</td>
                                <td style={{ textAlign: 'right', padding: '10px' }}>$50</td>
                            </tr> */}
                            {
                                res && res.billingDetails[0].tax == "null" ?
                                    <tr style={{ borderBottom: '1px solid #ddd', color: '#5c5a5a', fontSize: '14px', backgroundColor: '#f2f4f4', fontWeight: '600' }}>
                                        <td colSpan="2" style={{ textAlign: 'left', padding: '10px' }}>Tax</td>
                                        <td style={{ textAlign: 'right', padding: '10px' }}>$0</td>
                                    </tr>
                                    :
                                    <tr style={{ borderBottom: '1px solid #ddd', color: '#5c5a5a', fontSize: '14px', backgroundColor: '#f2f4f4', fontWeight: '600' }}>
                                        <td colSpan="2" style={{ textAlign: 'left', padding: '10px' }}>Tax</td>
                                        <td style={{ textAlign: 'right', padding: '10px' }}>${res.billingDetails[0].tax}</td>
                                    </tr>
                            }

                            <tr style={{ borderBottom: '1px solid #ddd', color: '#5c5a5a', fontSize: '15px', backgroundColor: '#dddede', fontWeight: '600' }}>
                                <td colSpan="2" style={{ textAlign: 'left', padding: '10px' }}>Total</td>
                                <td style={{ textAlign: 'right', padding: '10px' }}>${res.billingDetails[0].amount}</td>
                            </tr>
                        </table>
                    </div>


                ));
            }
        }
    }

    downloadPdf() {
        const inputText = document.getElementById('testContainer');
        // inputText.style.display = "block"
        html2canvas(inputText).then((canvasResult) => {
            const imgData = canvasResult.toDataURL('image/png');
            // inputText.style.display = "none";
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'JPEG', 0, 0);
            pdf.save("Receipt_" + this.state.recieptMonth + "_" + this.state.receiptYear + ".pdf");
        });
    }

    goReceipt() {
        this.setState({
            billingWithPlanDetailsLastData: this.state.billingWithPlanDetailsLastDataOne,
            receiptData: this.state.dataArrayOne,
            receiptHidden: false,
            pdfHidden: true,
            receiptYear: '',
            recieptMonth: ''
        });
    }

    selectTab(index, label) {
        if (label == "Company Information") {
            this.setState({
                selected: 2
            });
        } else if (label == "Packages") {
            this.setState({
                selected: 0
            });
        } else if (label == "Receipt") {
            this.setState({
                selected: 1
            });
        }
    }

    handleSubmit(event) {
        const data = {
            _id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
            company: this.state.companyName,
            country: this.state.country,
            company_address: this.state.companyAddress,
            company_zip: this.state.zip
        };

        updateCustomer(data).then((result) => {
            NotificationManager.success('Company details updated.', "Success");
        }).catch((error) => {
            NotificationManager.error("Company details not updated.", "Error");
        });

        event.preventDefault();
    }

    render() {
        return (
            <div className="body-area-custom">
                <section className="top-bar-row py-5">
                    <div className="container">
                        <Tabs selected={this.state.selected} className="w-100 cust-tab" onSelect={(index, label) => this.selectTab(index, label)}>
                            <Tab label="Packages">
                                {/* <div className="top-bar-row py-5" hidden={this.state.receiptHidden}> */}
                                <div className="top-bar-row py-5">
                                    <h2 className="border-bottom pb-3 mb-4">Billing &amp; subscription</h2>

                                    <div className="col-12 pb-5">
                                        {this.displayPlan()}
                                    </div>
                                    <p className="mb-3 custom-checkbox-price">
                                        <input type="radio" className="d-inline-block w-auto" value="Monthly" onChange={this.setPlanType.bind(this)} checked={this.state.billingPlanType == 'Monthly'} name="billingPlanType" />
                                        <label>Monthly Plan</label>
                                    </p>
                                    <p className="mb-3 custom-checkbox-price">
                                        <input type="radio" className="d-inline-block w-auto" value="Yearly" onChange={this.setPlanType.bind(this)} checked={this.state.billingPlanType == 'Yearly'} name="billingPlanType" />
                                        <label>Annual Plan</label>
                                    </p>
                                </div>
                                <div className="row mb-5">
                                    {this.displaySubscriptionPlans()}
                                </div>
                                <div className="row payment-section">
                                    {this.displaySubscriptionPlan()}


                                    {/* <div className="col-md-6">
                            <h4>Payment details</h4>
                            <p>Please add your payment details to avoid service interruption </p>
                            <input className="btn btn-primary text-uppercase rounded-0" defaultValue="Add payment details" type="submit" />
                        </div>
                        <div className="col-md-12"><hr /></div> */}


                                    {/* <div className="col-md-6">
                            <h4>Billing contact details</h4>
                            <ul>
                                <li><b>Plan:</b> <span>Starter</span></li>
                                <li><b>Cost:</b> <span>$19 / month</span></li>
                                <li><b>Status:</b> <span>In trial - <a href>Close account</a></span></li>
                            </ul>
                        </div> */}
                                </div>
                            </Tab>
                            <Tab label="Invoices">
                                <div className="top-bar-row py-5" hidden={this.state.receiptHidden}>
                                    {/* <div className="top-bar-row py-5"> */}
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <h2 className="border-bottom pb-3 mb-4">Receipts</h2>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card shadow p-4">
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered mb-0 receipts-table">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Ordered Id</th>
                                                                    <th scope="col">Ordered Date</th>
                                                                    <th scope="col">Amount</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.displayAllDetails()}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                {this.displayPlan()}
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="top-bar-row py-5" hidden={this.state.pdfHidden}>
                                    <div className="container">
                                        <div className="d-flex justify-content-between website"><h1 className="heading-font mb-3">Receipt generate</h1><button type="button" className="btn btn-primary website-btn" onClick={() => this.downloadPdf()}><i className="fa fa-download"></i> Download PDF</button><button type="button" className="btn btn-primary website-btn" onClick={() => this.goReceipt()}>Go Back</button></div>
                                        <div className="card mt-3">
                                            {this.showPdfBilling()}
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            <Tab label="Company Information">

                                <section className="edit-account-list py-5">
                                    <div className="account-table">
                                        <div className="container">
                                            <div className="card shadow-sm main-frm">
                                                <div className="account-form">
                                                    <form className="frm" onSubmit={this.handleSubmit.bind(this)}>
                                                        <div className="f-heading mb-4">
                                                            <h2 className="text-uppercase">Company information</h2>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Company Name</label>
                                                            <input type="text" className="form-control" placeholder="Company Name" autoComplete="off" name="companyName" onChange={this.handleChange.bind(this)} value={this.state.companyName} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Country</label>
                                                            <select className="form-control" name="country" onChange={this.handleChange.bind(this)}>
                                                                <option>{this.state.countryName}</option>
                                                                {
                                                                    this.state.countryList.map((result, i) =>
                                                                        <option key={i} value={result.name}>{result.name}</option>
                                                                    )
                                                                }
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Company Address</label>
                                                            <input type="text" className="form-control" placeholder="Company Address" name="companyAddress" onChange={this.handleChange.bind(this)} value={this.state.companyAddress} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>ZIP Code</label>
                                                            <input type="text" className="form-control" placeholder="ZIP code" name="zip" onChange={this.handleChange.bind(this)} value={this.state.zip} />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="submit" className="btn btn-primary text-uppercase rounded-0" defaultValue="Update company information" />
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section >

                            </Tab>
                        </Tabs>

                    </div>
                </section>
            </div>
        )
    }
}

export default Billing;