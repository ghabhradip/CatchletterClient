import React, { Component } from 'react';

import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { simpleParser } from 'mailparser';
import {
    getListOfMailsByWebsite,
    deleteWebsiteById,
    markMailAsFavourite,
    removeMailAsFavouriteId,
    getMyMailsByWebsiteWithPagination,
    getwebsitebydatecheck,
    getBillingData
} from '../../../api/commonApi';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Pagination from "react-js-pagination";
import { CopyToClipboard } from 'react-copy-to-clipboard';

import EmailDetails from '../EmailDetails/EmailDetails';
import WebsitesList from '../WebsitesList/WebsitesList';

import Login from '../Login/Login';
import _imageURL from '../../_imageURL';

let IsLoggedIn = false;

class MailsByWebsite extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emailDetails: [],
            totalEmails: '0',
            website_name: '',
            emailDomain: '',
            isLength: false,
            pageNumber: 1,
            totalItemsCount: 0,
            copied: false,
            billingExpiryValue: '',
            expireMessage: ''
        };

        if (localStorage.getItem("catchLetterDetails")) {
            IsLoggedIn = true;
        }

        if (IsLoggedIn == false) {
            this.props.onHistory.push({ pathname: '/' });
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let messageOne;

        if (this.props.onHistory.location.value) {
            localStorage.setItem("emailDomainDetails", JSON.stringify(this.props.onHistory.location.value));
        }

        if (localStorage.getItem("emailDomainDetails")) {
            let value = JSON.parse(localStorage.getItem("emailDomainDetails"));
            if (value) {


                // billing data
                const billingData = {
                    userId: JSON.parse(localStorage.getItem("catchLetterDetails"))._id
                };
                // getBillingData(billingData).then((result1) => {

                //     if (result1.data.success == true) {
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
                // });

                const valueOne = {
                    current_date: new Date(),
                    userId: JSON.parse(localStorage.getItem("catchLetterDetails"))._id
                };

                getwebsitebydatecheck(valueOne).then((res) => {
                    if (res.data.success == true) {
                        const message = res.data.data.message;
                        if (message == "You are within billing date.") {

                            /** call rest apis */

                            const data = {
                                emailDomain: value.emailDomain,
                                unique_id: value.unique_id,
                                page: this.state.pageNumber
                            }
                            this.setState({
                                emailDomain: JSON.parse(localStorage.getItem("emailDomainDetails")).emailDomain,
                                website_name: JSON.parse(localStorage.getItem("emailDomainDetails")).website_name
                            });

                            getMyMailsByWebsiteWithPagination(data).then((res) => {
                                this.setState({
                                    isLength: true
                                });
                                if (res.data.success == true) {

                                    for (let i = 0; i < res.data.data.message.length; i++) {
                                        res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                                    }
                                    this.setState({
                                        emailDetails: res.data.data.message,
                                        totalItemsCount: res.data.data.totalCount
                                    });
                                } else {

                                    // NotificationManager.error("No mails found.", "Error");
                                }
                            }).catch((error) => {

                                this.setState({
                                    isLength: true
                                });
                                // NotificationManager.error("Please try again later.", "Error");
                            });


                        } else if (message == "Billing date is expired.") {
                            this.props.onHistory.push({ pathname: '/billingExpire' });
                        }
                    }
                }).catch((error) => {

                    // this.props.onHistory.push({ pathname: '/billingExpire' });
                });
            }
        }
    }

    handlePageChange(pageNumber) {
        this.setState({ pageNumber: pageNumber });
        let value = JSON.parse(localStorage.getItem("emailDomainDetails"));

        const data = {
            emailDomain: value.emailDomain,
            unique_id: value.unique_id,
            page: pageNumber
        }

        getMyMailsByWebsiteWithPagination(data).then((res) => {
            if (res.data.success == true) {

                for (let i = 0; i < res.data.data.message.length; i++) {
                    res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                }
                this.setState({
                    emailDetails: res.data.data.message,
                    totalItemsCount: res.data.data.totalCount
                });
            } else {

                NotificationManager.error("No mails found.", "Error");
            }
        }).catch((error) => {

            NotificationManager.error("Please try again later.", "Error");
        });
    }

    /** display list of mails */
    displayMails() {
        if (this.state.emailDetails.length != 0) {
            return this.state.emailDetails.map((res, index) => (
                <div className="col-12 col-md-6 col-lg-3" key={index}>
                    <div className="card shadow">
                        {
                            res.header && res.header.date && res.header.from && res.header.subject && res.header.to ?
                                <div className="card-header">
                                    <h2><a href="javascript:void(0)" onClick={() => this.showMail(res.uid, res._id)}>{res.header.subject[0]}</a></h2>
                                    <p><span>from: </span> <a href="javascript:void(0)" onClick={() => this.showMail(res.uid, res._id)}>{(res.header.from[0]).split("<")[0]}</a></p>
                                    <p><span>Date: </span> <a href="javascript:void(0)">{res.header.date[0].split(" ")[0] + " " + res.header.date[0].split(" ")[1] + " " + res.header.date[0].split(" ")[2] + " " + res.header.date[0].split(" ")[3] + " " + res.header.date[0].split(" ")[4]}</a></p>
                                    {
                                        res && res.flag == 0 ?
                                            <a href="javascript:void(0)" className="star-ml">
                                                <i className="fa fa-star-o" onClick={() => this.markMailAsFavourite(res.uid, res.seqno)} />
                                            </a>
                                            :
                                            <a href="javascript:void(0)" className="star-ml">
                                                <i className="fa fa-star" onClick={() => this.removeMailAsFavourite(res.uid, res.seqno)} />
                                            </a>
                                    }

                                </div>
                                :
                                <div>Header not specified.</div>
                        }

                        <div className="card-body" >
                            <figure style={{ height: 150, overflow: 'hidden' }}>
                                {/* {ReactHtmlParser(res.htmlData)} */}
                                <img src={res.imageUrl} style={{ width: '100%' }} />
                            </figure>
                        </div>
                        <div className="card-footer clearfix">
                            {/* <span className="float-left left">
                                <input type="checkbox" className="checkbox-custom" title="click to select" />
                            </span> */}
                            <a href="javascript:void(0)" className="text-primary float-right" onClick={() => this.showMail(res.uid, res._id)}> View Email </a>
                        </div>
                    </div>
                </div>
            ));
        }
        else if (this.state.isLength == false) {
            return <div className="p-4"><h3>Loading...</h3></div>
        }
        else {
            return (
                <div className="no-image no-email">
                    <img src={require('../../../../assets/images/no_emails.gif')} className="img-fluid mb-3" />
                    <h2 className="mb-3">Hold up! We're still waiting for emails to come in from {this.state.website_name}</h2>
                    <p>Make sure you've signed up for their newsletters using email: {this.state.emailDomain}</p>

                    <p>It doesn't look like {this.state.website_name} has sent out a newsletter since you signed up to Catchletter; as soon as they do it will be captured and available to view here in your dashboard along with the website screenshot for the day.</p>
                </div>
            )
        }
    }

    markMailAsFavourite(value, seqno) {
        const data = {
            emailDomain: JSON.parse(localStorage.getItem("emailDomainDetails")).emailDomain,
            unique_id: JSON.parse(localStorage.getItem("emailDomainDetails")).unique_id,
            id: JSON.stringify(value),
            user_id: JSON.parse(localStorage.getItem("emailDomainDetails")).websiteId,
            seqno: JSON.stringify(value)
        };


        let toChangeEmailArray = this.state.emailDetails;
        toChangeEmailArray.map((item) => {
            if (item.uid == value) {
                item.flag = 1;
            }
        });
        this.setState({ emailDetails: toChangeEmailArray });

        markMailAsFavourite(data).then((res) => {
            if (res.data.success == true) {
                const data = {
                    emailDomain: JSON.parse(localStorage.getItem("emailDomainDetails")).emailDomain,
                    unique_id: JSON.parse(localStorage.getItem("emailDomainDetails")).unique_id
                }
                getListOfMailsByWebsite(data).then((res) => {

                    if (res) {


                        // this.setState({
                        //     emailDetails: res.data.data.message
                        // });
                        // const that=this;
                        // (async function loop() {
                        //     for (let i = 0; i < res.data.data.message.length; i++) {
                        //         await new Promise(resolve => {
                        //             simpleParser(res.data.data.message[i].buffer, (err, parsed) => {
                        //                 if(parsed.html)
                        //                 res.data.data.message[i].htmlData=parsed.html
                        //                 else
                        //                 res.data.data.message[i].htmlData = res.data.data.message[i].body;
                        //                  resolve(parsed);
                        //             });

                        //         });
                        //         console.log(i);

                        //     }
                        //     that.setState({
                        //         emailDetails: res.data.data.message
                        //     });
                        // })();
                        for (let i = 0; i < res.data.data.message.length; i++) {
                            res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                        }
                        this.setState({
                            emailDetails: res.data.data.message
                        });
                    }
                }).catch((error) => {

                    NotificationManager.error("Please try again later.", "Error");
                });
                //NotificationManager.success(res.data.data.message, "Success");
            }
        }).catch((error) => {

            NotificationManager.error("Please try again later.", "Error");
        });
    }

    removeMailAsFavourite(value, seqno) {
        const data = {
            emailDomain: JSON.parse(localStorage.getItem("emailDomainDetails")).emailDomain,
            unique_id: JSON.parse(localStorage.getItem("emailDomainDetails")).unique_id,
            id: JSON.stringify(value),
            seqno: JSON.stringify(value)
        };

        let toChangeEmailArray = this.state.emailDetails;
        toChangeEmailArray.map((item) => {
            if (item.uid == value) {
                item.flag = 0;
            }
        });
        this.setState({ emailDetails: toChangeEmailArray });
        removeMailAsFavouriteId(data).then((res) => {
            if (res.data.success == true) {
                const data = {
                    emailDomain: JSON.parse(localStorage.getItem("emailDomainDetails")).emailDomain,
                    unique_id: JSON.parse(localStorage.getItem("emailDomainDetails")).unique_id
                }
                getListOfMailsByWebsite(data).then((res) => {

                    if (res) {
                        // this.setState({
                        //     emailDetails: res.data.data.message
                        // });
                        // const that=this;
                        // (async function loop() {
                        //     for (let i = 0; i < res.data.data.message.length; i++) {
                        //         await new Promise(resolve => {
                        //             simpleParser(res.data.data.message[i].buffer, (err, parsed) => {
                        //                 if(parsed.html)
                        //                 res.data.data.message[i].htmlData=parsed.html
                        //                 else
                        //                 res.data.data.message[i].htmlData = res.data.data.message[i].body;
                        //                  resolve(parsed);
                        //             });

                        //         });
                        //         console.log(i);

                        //     }
                        //     that.setState({
                        //         emailDetails: res.data.data.message
                        //     });
                        // })();
                        for (let i = 0; i < res.data.data.message.length; i++) {
                            res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";

                        }
                        this.setState({
                            emailDetails: res.data.data.message
                        })
                    }
                }).catch((error) => {

                    NotificationManager.error("Please try again later.", "Error");
                });
                // NotificationManager.success(res.data.data.message, "Success");
            }
        }).catch((error) => {

            NotificationManager.error("Please try again later.", "Error");
        });
    }

    showMail(value, emailId) {
        let userId = JSON.parse(localStorage.getItem("emailDomainDetails")).websiteId;
        const data = {
            emailDomain: JSON.parse(localStorage.getItem("emailDomainDetails")).emailDomain,
            unique_id: JSON.parse(localStorage.getItem("emailDomainDetails")).unique_id,
            id: JSON.stringify(value),
            user_id: JSON.parse(localStorage.getItem("emailDomainDetails")).websiteId,
            emailId: emailId
        };
        this.props.onHistory.push({ pathname: "/emailDetail/" + btoa(userId), value: data });
    }

    deleteWebsite() {
        if (localStorage.getItem("emailDomainDetails")) {
            const x = window.confirm("Are you sure to delete this website?");
            if (x == true) {
                let websiteId = JSON.parse(localStorage.getItem("emailDomainDetails")).websiteId;
                if (websiteId) {

                    deleteWebsiteById(websiteId).then((res) => {

                        let websitesLengthData = localStorage.getItem("websiteAdded");
                        localStorage.setItem("websiteAdded", websitesLengthData - 1);
                        if (res) {
                            this.props.onHistory.push({ pathname: "/list" });
                        }
                    }).catch((error) => {
                        NotificationManager.error("Please try again later.", "Error");

                        // NotificationManager.error("Please try again later.", "Error");
                    });
                }
            }
        }
    }

    copyToClipBoard() {
        this.setState({ copied: true });
        NotificationManager.success("Email is copied.", "Success");
    }

    displayWebsiteAndTags() {
        if (localStorage.getItem("emailDomainDetails")) {
            return (
                <h4>{JSON.parse(localStorage.getItem("emailDomainDetails")).website_name}

                    {
                        JSON.parse(localStorage.getItem("emailDomainDetails")).tags.length != 0 ?
                            JSON.parse(localStorage.getItem("emailDomainDetails")).tags.map((res, index) => (
                                <small key={index} className="badge badge-secondary font-weight-light">
                                    {res.text}
                                </small>
                            )) : (
                                <div></div>
                            )
                    }
                    <p>
                        <span className="ti-email mr-2 text-muted" />{JSON.parse(localStorage.getItem("emailDomainDetails")).emailDomain}
                        
                    </p>
                    <div className="copy-box float-left">
                            <CopyToClipboard text={JSON.parse(localStorage.getItem("emailDomainDetails")).emailDomain}
                                onCopy={() => this.copyToClipBoard()}>
                                <button className="btn btn-success btn-sm"><div className="fa fa-copy"></div> Copy to clipboard</button>

                            </CopyToClipboard>
                            {/* <button className="copyed-to-clipboard" hidden={this.state.hiddenClipBoard}>Copied</button> */}
                        </div>

                </h4>

            )
        }
    }

    displayTotalEmail() {
        if (this.state.emailDetails.length != 0) {
            return (
                <div className="d-flex align-items-center justify-content-end capture-font">
                    <h4><span className="ti-email" /></h4> <h2>EMAIL CAPTURED</h2> <h4 className="badge badge-primary text-white">{this.state.totalItemsCount}</h4>
                </div>
            )
        }
        else {
            return (
                <div className="d-flex align-items-center justify-content-end capture-font">
                    <h4><span className="ti-email" /></h4> <h2>EMAIL CAPTURED</h2> <h4 className="badge badge-primary text-white">{this.state.totalItemsCount}</h4>
                </div>
            )
        }
    }

    websiteEdit() {
        this.props.onHistory.push({ pathname: "/websiteEdit", websiteId: JSON.parse(localStorage.getItem("emailDomainDetails"))._id });
    }

    goPaymentPage() {
        this.props.onHistory.push({ pathname: "/billing" });
    }


    render() {
        return (
            <div className="body-area-custom">
                <section className="top-star-row py-5">
                    <div className="container">
                        {
                            this.state.expireMessage.length != 0 ?
                                <div className="alert alert-warning" role="alert">

                                    {/* Your plan will expire in {this.state.billingExpiryValue} days, please enter your <a style={{ color: "#007bff", cursor: "pointer" }} onClick={() => this.goPaymentPage()}>payment details</a> in order to continue to use catchLetter and to not lose your email history */}
                                    {this.state.expireMessage}, please enter your <a style={{ color: "#007bff", cursor: "pointer" }} onClick={() => this.goPaymentPage()}>payment details</a> in order to continue to use catchLetter and to not lose your email history
                                </div> : ''

                        }
                        <div className="count-hh">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card shadow mail-details-head">
                                        <div className="card-body p-4">
                                            <div className="row">
                                                {/* <div className="col-2 pl-4" style={{ maxWidth: 100 }}>
                                                    <div className="round-circle">
                                                        <img src="https://cdn.myntassets.com/pwa/icons/ios/app/Icon-App-60x60@3x.png" className="img-fluid" alt="emailer" />
                                                    </div> 
                                                </div> */}
                                                <div className="col-8">
                                                    {this.displayWebsiteAndTags()}
                                                    {/* <h4>Myntra  <small className="badge badge-secondary font-weight-light">Myntra</small></h4> */}
                                                    {/* <p><span className="ti-email mr-2 text-muted" />someone@example.com</p> */}
                                                </div>

                                                <div className="col-4">
                                                    <div className="d-flex justify-content-end align-items-center">
                                                        <a href="javascript:void(0)" onClick={() => this.deleteWebsite()} className="btn mr-2">DELETE</a>
                                                        <a href="javascript:void(0)" onClick={() => this.websiteEdit()} className="btn btn-primary">EDIT</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            {this.displayTotalEmail()}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                <section className="pb-4 count-sec">
                    <div className="container">
                        <div className="top-h mb-4">
                            <h4 className="border-bottom pb-3">Email Inbox</h4>
                        </div>
                        <div className="mail-cards new-mail-cards">
                            <div className="row">
                                {this.displayMails()}
                            </div>
                        </div>
                        <div>
                            <Pagination
                                activePage={this.state.pageNumber}
                                itemsCountPerPage={10}
                                totalItemsCount={this.state.totalItemsCount}
                                pageRangeDisplayed={2}
                                onChange={this.handlePageChange.bind(this)}
                            />
                        </div>
                    </div>
                </section>
            </div >
        )
    }
}

export default MailsByWebsite;