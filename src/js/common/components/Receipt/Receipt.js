import React, { Component } from 'react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

import { getAllBillingWithPagination } from '../../../api/commonApi';

class Receipt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            isLength: false,
            billingWithPlanDetailsLastData: [],
            receiptData: []
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let value;

        if (localStorage.getItem("catchLetterDetails")) {
            value = JSON.parse(localStorage.getItem("catchLetterDetails"));
        }

        const data = {
            userId: value._id,
            page: this.state.pageNumber
        };

        getAllBillingWithPagination(data).then((res) => {
            let dataArray = [];
            let lastData = [];
            if (res.data.success == true) {
                res.data.data.subscriptionData.map((res1) => {
                    if (res1.details.length != 0) {
                        let dataOne = res1.details[res1.details.length - 1];
                        lastData.push(dataOne);
                        for (let i = 0; i < res1.details.length; i++) {
                            if (i != 0) {
                                dataArray.push({ orderId: res1.details[i].billingDetails[0].order_id, orderDate: res1.details[i].billingDetails[0].billingDate, amount: res1.details[i].billingDetails[0].amount });
                            }
                        }
                    }
                });
                this.setState({
                    receiptData: dataArray,
                    billingWithPlanDetailsLastData: lastData,
                    isLength: true
                });
            }
        }).catch((error) => {
            this.setState({
                isLength: true
            });
        });
    }

    //display all details
    displayAllDetails() {
        if (this.state.receiptData.length != 0) {
            return this.state.receiptData.map((result2, index) => (
                <tr key={index}>
                    <td>{result2.orderId}</td>
                    <td>{new Date(result2.orderDate).getDate() + "/" + new Date(result2.orderDate).getMonth() + "/" + new Date(result2.orderDate).getFullYear()}</td>
                    <td>${result2.amount.slice(0, -2)}</td>
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
                        <li>
                            <p>Package Validity :</p><p><strong>{new Date(result1.billingDetails[0].expiryDate).getDate() - new Date(result1.billingDetails[0].billingDate).getDate()} Days</strong></p>
                        </li>
                        <li>
                            <p>Package Information :</p>
                            {/* <p>
                                <span>10 websites monitored 24/7</span>
                                <span>1 x Monthly summary email roundup Get a roundup of all emails we've recieved in the last month</span>
                                <span>1 x Alert email Get instantly notified when a monitored website send an email containing certain keywords you would like to monitor</span>
                                <span>12-month email retention</span>
                                <span>All emails captured and available to your entire team</span>
                                <span>Competitor email analytics</span>
                            </p> */}
                            <p>
                                {ReactHtmlParser(result1.planDetails[0].subs_desc)}
                            </p>
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


    render() {
        return (
            <div className="top-bar-row py-5">
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
                                            {/* <tr>
                                                <td><a href="">Download</a></td>
                                                <td>12 july </td>
                                                <td>$100</td>
                                            </tr>
                                            <tr>
                                                <td><a href="">Download</a></td>
                                                <td>12 july </td>
                                                <td>$100</td>
                                            </tr>
                                            <tr>
                                                <td><a href="">Download</a></td>
                                                <td>12 july </td>
                                                <td>$100</td>
                                            </tr>
                                            <tr>
                                                <td><a href="">Download</a></td>
                                                <td>12 july </td>
                                                <td>$100</td>
                                            </tr>
                                            <tr>
                                                <td><a href="">Download</a></td>
                                                <td>12 july </td>
                                                <td>$100</td>
                                            </tr>
                                            <tr>
                                                <td><a href="">Download</a></td>
                                                <td>12 july </td>
                                                <td>$100</td>
                                            </tr>
                                            <tr>
                                                <td><a href="">Download</a></td>
                                                <td>12 july </td>
                                                <td>$100</td>
                                            </tr>
                                            <tr>
                                                <td><a href="">Download</a></td>
                                                <td>12 july </td>
                                                <td>$100</td>
                                            </tr> */}
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
        )
    }
}

export default Receipt;