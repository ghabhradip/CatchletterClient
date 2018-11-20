import React, { Component } from 'react';

import CreateAlert from '../CreateAlert/CreateAlert';
import EditAlert from '../EditAlert/EditAlert';
import Billing from '../Billing/Billing';
import {
    getListOfAlertsByUserId,
    deleteAlertById,
    getwebsitebydatecheck,
    getBillingData
} from '../../../api/commonApi';

class CustomDomain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totalData: [],
            expireMessage: ''
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let value;
        let messageOne;

        if (localStorage.getItem("catchLetterDetails")) {
            value = JSON.parse(localStorage.getItem("catchLetterDetails"));
            if (value) {
                const valueOne = {
                    current_date: new Date(),
                    userId: value._id
                };

                getwebsitebydatecheck(valueOne).then((res) => {
                    if (res.data.success == true) {
                        const message = res.data.data.message;
                        if (message == "You are within billing date.") {
                            // billing data
                            const billingData = {
                                userId: value._id
                            };
                            // getBillingData(billingData).then((result1) => {

                            //     if (result1.data.success == true) {
                            //         // let billingExpiryValue = result1.data.data.details[0].details[result1.data.data.details[0].details.length - 1].billingDetails[0].expiryDate;
                            //         let billingExpiryValue = result1.data.data.details[0].details[result1.data.data.details[0].details.length - 1].billingDetails[0].expiryDate;
                            //         if (billingExpiryValue) {
                            //             let val = new Date(billingExpiryValue).getDate() - new Date().getDate();
                            //             if (new Date(billingExpiryValue).getDate() - new Date().getDate() == 0) {
                            //                 messageOne = "Your plan is going to expire today";
                            //             } else {
                            //                 messageOne = "Your plan will expire in " + val + " day(s)";
                            //             }
                            //             if (val != NaN) {
                            //                 this.setState({
                            //                     expireMessage: messageOne
                            //                     // billingExpiryValue: new Date(billingExpiryValue).getDate() - new Date().getDate()
                            //                 });
                            //             }
                            //         }
                            //     }
                            // }).catch((error) => {
                            //     console.log("err :", error);
                            //     this.props.loaderShow(false);
                            // });

                            /** get alert list */
                            this.getAlertList();
                        } else if (message == "Billing date is expired.") {
                            this.props.onHistory.push({ pathname: '/billingExpire' });
                        }
                    }
                }).catch((error) => {
                });
            }

        }
    }

    getAlertList() {
        let value;
        if (localStorage.getItem("catchLetterDetails")) {
            value = JSON.parse(localStorage.getItem("catchLetterDetails"));
        }
        const data = {
            user_id: value._id
        };
        getListOfAlertsByUserId(data).then((res) => {
            if (res.data.status = true && res.data.data.type == "all") {
                this.setState({
                    totalData: res.data.data.message
                });
            }
            else if (res.data.status = true && res.data.data.type == "single") {
                this.setState({
                    totalData: res.data.data.message
                });
            }
        }).catch((error) => {
            this.setState({
                totalData: []
            });
        });
        return value;
    }

    goCreateAlert() {
        this.props.onHistory.push({ pathname: "/createAlert" });
    }

    goCreateCustomDomain() 
    {
        this.props.onHistory.push({ pathname: "/create-custom-domain" });

    }

    deleteAlert(res) {
        deleteAlertById({ _id: res._id }).then((res2) => {
            this.getAlertList();
        }).catch((error) => {

        });
    }

    displayAlerts() {
        if (this.state.totalData.length != 0) {
            return this.state.totalData.map((res, index) => (
                <div className="w-100 d-md-flex custom-h" key={index}>
                    {
                        res.websiteDetails.length != 0 ?
                            <div className="col-md-6 d-md-flex align-items-center">
                                <div className="media ">
                                    <div className="media-body">
                                        <h5 className="mt-0">{res.websiteDetails[0].website_name}</h5>
                                        <p>Sends an alert when {res.websiteDetails[0].website_name} sends an email</p>
                                    </div>
                                </div>
                            </div> : null
                    }

                    {
                        res.websiteDetails.length != 0 ?
                            <div className="col-md-6 d-md-flex align-items-center justify-content-end">
                                {/* <button type="button" className="btn" onClick={() => this.editAlert(res)}>Edit</button> */}
                                <button type="button" className="badge badge-danger" onClick={() => this.deleteAlert(res)}>Delete</button>
                            </div> : null
                    }

                </div>
            ));
        }
    }

    goPaymentPage() {
        this.props.onHistory.push({ pathname: "/billing" });
    }


    render() {
        return (
            <div className="body-area-custom">
                <section className="top-bar-row py-5">
                    <div className="container">
                        {
                            this.state.expireMessage.length != 0 ?
                                <div className="alert alert-warning" role="alert">

                                    {/* Your plan will expire in {this.state.billingExpiryValue} days, please enter your <a style={{ color: "#007bff", cursor: "pointer" }} onClick={() => this.goPaymentPage()}>payment details</a> in order to continue to use catchLetter and to not lose your email history */}
                                    {this.state.expireMessage}, please enter your <a style={{ color: "#007bff", cursor: "pointer" }} onClick={() => this.goPaymentPage()}>payment details</a> in order to continue to use catchLetter and to not lose your email history
                                </div> : ''

                        }
                        <div className="d-flex justify-content-between website">
                            <h2 className="heading-font mb-3">Add Custom Domain</h2>
                            <button type="button" className="btn btn-primary website-btn" onClick={() => this.goCreateCustomDomain()}>
                                <i className="fa fa-plus" />
                                Add Custom Domain
                        </button>
                        </div>
                        <div className="row d-md-flex website py-2">
                            <div className="col-md-12">
                                <p>Enter your custom domain here for receiving emails with your custom domain. Please note that in order to receive email from your custom domain you will need to add certain DNS records. If you do not have access to your DNS records you will not be able to use this feature. We recommend that you use a subdomain or a separate domain name than your actual company domain name in order to avoid making changes to your mail settings that will affect you in other areas.</p>
                            </div>
                            <div className="col-md-12 mt-3">
                                <div className="all-website-list hubpost">
                                    {this.displayAlerts()}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default CustomDomain;
