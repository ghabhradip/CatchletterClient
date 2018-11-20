import React, { Component } from 'react';

import {
    getMailById,
    markMailAsFavourite,
    removeMailAsFavouriteId,
    getListOfMailsByWebsite,
    getBillingData,
    deleteEmail
} from '../../../api/commonApi';
import { simpleParser } from 'mailparser';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Login from '../Login/Login';
import { Tabs, Tab } from 'react-bootstrap-tabs';
import _imageURL from '../../_imageURL';
import moment from 'moment';
import momentone from 'moment-timezone';
import qs from 'simple-query-string';

let currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// let currentTimezone = "Pacific/Midway";

const months = {
    "Jan": "01",
    "Feb": "02",
    "Mar": "03",
    "Apr": "04",
    "May": "05",
    "Jun": "06",
    "Jul": "07",
    "Aug": "08",
    "Sep": "09",
    "Oct": "10",
    "Nov": "11",
    "Dec": "12"
};

const monthNames = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec"
};

let IsLoggedIn = false;

class EmailDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emailDetail: [],
            showStar: true,
            showBlankStar: false,
            isLength: false,
            expireMessage: '',
            currentTimezone: ''
        };

        if (localStorage.getItem("catchLetterDetails")) {
            IsLoggedIn = true;
        }

        if (IsLoggedIn == false) {
            this.props.onHistory.push({ pathname: '/' });
        }
    }


    getSelectedTab(index, label) {
        if (index == 1) {
            setTimeout(() => {
                const inputItem = document.getElementById("emailDetailsIframe");
                if (inputItem) {
                    let scrollHeight = inputItem.contentWindow.document.body.scrollHeight;
                    inputItem.style.height = scrollHeight + 'px';
                }
            }, 500)
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        let messageOne;

        // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
        // console.log(momentone('22/08/2018 13:07:56', 'DD/MM/YYYY HH:mm:ss').tz("America/Los_Angeles").format('YYYY/MM/DD HH:mm'))

        if (this.props.onHistory.location.value) {
            localStorage.setItem("emailDetails", JSON.stringify(this.props.onHistory.location.value));
        }

        if (localStorage.getItem("emailDetails")) {
            let value = JSON.parse(localStorage.getItem("emailDetails"));

            const url = this.props.onHistory.location.search;
            if (url) {
                const parsed = qs.parse(this.props.onHistory.location.search);
                let data = {};

                if (parsed.emailDomain && parsed.uid && parsed.uniqueId) {
                    if (localStorage.getItem("catchLetterDetails")) {
                        data.emailDomain = new Buffer(parsed.emailDomain, 'base64').toString('ascii');
                        data.id = new Buffer(parsed.uid, 'base64').toString('ascii');
                        data.unique_id = new Buffer(parsed.uniqueId, 'base64').toString('ascii');
                        data.user_id = JSON.parse(localStorage.getItem("catchLetterDetails"))._id;

                        const that = this;
                        getMailById(data).then((res) => {
                            if (res.data.success === true) {
                                {
                                    if (res.data.data.message[0].parsedHtml) {
                                        res.data.data.message[0].htmlData = res.data.data.message[0].parsedHtml;
                                        res.data.data.message[0].imageScreenshot = _imageURL + value.emailDomain + "_" + value.id + ".png";
                                        that.setState({
                                            emailDetail: res.data.data.message[0],
                                            isLength: true,
                                            // currentTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                                        });
                                    }
                                    else {
                                        simpleParser(res.data.data.message[0].buffer, (err, parsed) => {
                                            if (parsed.html)
                                                res.data.data.message[0].htmlData = parsed.html
                                            else
                                                res.data.data.message.htmlData[0] = res.data.data.message[0].body;
                                            this.setState({
                                                emailDetail: res.data.data.message[0]
                                            });
                                            if (localStorage.getItem("emailDetails")) {
                                                const value = JSON.parse(localStorage.getItem("emailDetails"));
                                                setTimeout(() => {
                                                    if (that.state.emailDetail) {
                                                        let emailDetail = this.state.emailDetail;
                                                        // console.log("emailDetail :", months[this.state.emailDetail.header.date[0].split(" ")[2]]);
                                                        emailDetail.imageScreenshot = _imageURL + value.emailDomain + "_" + value.id + ".png";
                                                        that.setState({
                                                            emailDetail: emailDetail,
                                                            isLength: true,
                                                            // currentTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                                                        });
                                                    }
                                                }, 100)

                                            }
                                        });
                                    }
                                }

                            }
                        }).catch((error) => {
                            this.setState({
                                isLength: true
                            });
                        });
                    }
                }
            } else {
                if (value) {
                    const that = this;
                    getMailById(value).then((res) => {
                        if (res.data.success === true) {
                            if (res.data.data.message[0].parsedHtml) {
                                res.data.data.message[0].htmlData = res.data.data.message[0].parsedHtml;
                                res.data.data.message[0].imageScreenshot = _imageURL + value.emailDomain + "_" + value.id + ".png";
                                that.setState({
                                    emailDetail: res.data.data.message[0],
                                    isLength: true,
                                    // currentTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                                });
                            }
                            else {
                                simpleParser(res.data.data.message[0].buffer, (err, parsed) => {
                                    if (parsed.html)
                                        res.data.data.message[0].htmlData = parsed.html
                                    else
                                        res.data.data.message.htmlData[0] = res.data.data.message[0].body;
                                    this.setState({
                                        emailDetail: res.data.data.message[0]
                                    });
                                    if (localStorage.getItem("emailDetails")) {
                                        const value = JSON.parse(localStorage.getItem("emailDetails"));
                                        setTimeout(() => {
                                            if (that.state.emailDetail) {
                                                let emailDetail = this.state.emailDetail;
                                                // console.log("emailDetail :", months[this.state.emailDetail.header.date[0].split(" ")[2]]);
                                                emailDetail.imageScreenshot = _imageURL + value.emailDomain + "_" + value.id + ".png";
                                                that.setState({
                                                    emailDetail: emailDetail,
                                                    isLength: true,
                                                    // currentTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                                                });
                                            }
                                        }, 100)

                                    }
                                });
                            }
                        }
                    }).catch((error) => {
                        this.setState({
                            isLength: true
                        });
                    });
                }
            }
        }
    }


    displayScreenshot() {
        if (this.state.emailDetail.length != 0) {
            return (
                <div className="row">
                    <div className="col-12">
                        <div className="card">

                            <div className="card-body py-3">
                                <figure>
                                    <img src={this.state.emailDetail.imageScreenshot} />
                                </figure>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
    displayMail() {
        if (this.state.emailDetail.length != 0) {
            return (
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            {/* <div className="card-header">
                                <h2>{this.state.emailDetail.header.subject[0]}</h2>
                                <div className="row pt-3">
                                    <div className="col-3" style={{ maxWidth: 80 }}>
                                        <div className="round-circle">

                                        </div>
                                    </div>
                                    <div className="col-9">
                                        <p><span>from: </span> <a href="javascript:void(0)">{(this.state.emailDetail.header.from[0]).split("<")[0]}</a></p>
                                        <p><span>to: </span> <a href="javascript:void(0)">{this.state.emailDetail.header.to[0]}</a></p> 
                                        <p><span>Date: </span> <a href="javascript:void(0)">{this.state.emailDetail.header.date[0]}</a></p>
                                        <p><span>Date: </span> <a href="javascript:void(0)">{this.state.emailDetail.header.date[0].split(" ")[0] + " " + this.state.emailDetail.header.date[0].split(" ")[1] + " " + this.state.emailDetail.header.date[0].split(" ")[2] + " " + this.state.emailDetail.header.date[0].split(" ")[3]}</a></p>
                                        {
                                            this.state.emailDetail.length != 0 && this.state.emailDetail.flag == 0 ?
                                                <a href="javascript:void(0)" className="star-ml">
                                                    <i className="fa fa-star-o" onClick={() => this.markMailAsFavourite(this.state.emailDetail.uid, this.state.emailDetail.seqno)} />
                                                </a>
                                                :
                                                <a href="javascript:void(0)" className="star-ml">
                                                    <i className="fa fa-star" onClick={() => this.removeMailAsFavourite(this.state.emailDetail.uid, this.state.emailDetail.seqno)} />
                                                </a>
                                        }

                                    </div>
                                </div>
                            </div> */}
                            <div className="card-body py-3">
                                <iframe frameborder="0" scrolling="yes" width="100%" srcdoc={this.state.emailDetail.htmlData} id="emailDetailsIframe">
                                    {/* {ReactHtmlParser(this.state.emailDetail.htmlData)} */}
                                </iframe>
                            </div>
                            {/* <div className="card-footer clearfix">
                                <p className="m-0"> Click <a href="javascript:void(0)" className="text-primary">
                                    Here
                            </a> To Unsubscribe </p>
                            </div> */}
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.isLength == false) {
            return <div className="p-4"><h3>Loading...</h3></div>
        }
        else {
            return (
                <div className="p-4">No content found.</div>
            )
        }
    }

    markMailAsFavourite(value, seqno) {

        const data = {
            emailDomain: JSON.parse(localStorage.getItem("emailDetails")).emailDomain,
            unique_id: JSON.parse(localStorage.getItem("emailDetails")).unique_id,
            id: JSON.stringify(value),
            user_id: JSON.parse(localStorage.getItem("emailDetails")).user_id,
            seqno: JSON.stringify(value)
        };
        let emailDetail = this.state.emailDetail;
        emailDetail.flag = 1;
        this.setState({ emailDetail: emailDetail });
        markMailAsFavourite(data).then((res) => {
            if (res.data.success == true) {
                let emailDetail = this.state.emailDetail;
                emailDetail.flag = 1;
                this.setState({
                    emailDetail: emailDetail
                })
            }
            else {
                NotificationManager.error("Email is not favourite.", "Error");
            }
        }).catch((error) => {
            NotificationManager.error("Please try again later.", "Error");
        });

    }

    removeMailAsFavourite(value, seqno) {
        const data = {
            emailDomain: JSON.parse(localStorage.getItem("emailDetails")).emailDomain,
            unique_id: JSON.parse(localStorage.getItem("emailDetails")).unique_id,
            id: JSON.stringify(value),
            seqno: JSON.stringify(value)
        };
        let emailDetail = this.state.emailDetail;
        emailDetail.flag = 0;
        this.setState({ emailDetail: emailDetail });
        removeMailAsFavouriteId(data).then((res) => {
            if (res.data.success == true) {
                let emailDetail = this.state.emailDetail;
                emailDetail.flag = 0;
                this.setState({
                    emailDetail: emailDetail
                });
            }
            else {
                NotificationManager.error("Email is not unfavourite.", "Error")
            }
        }).catch((error) => {
            NotificationManager.error("Please try again later.", "Error")
        });
    }

    goPaymentPage() {
        this.props.onHistory.push({ pathname: "/billing" });
    }

    deleteEmail() {
        if (localStorage.getItem("emailDetails")) {
            let value = JSON.parse(localStorage.getItem("emailDetails"));
            if (value) {
                deleteEmail(value.emailId).then((res) => {
                    if (res.data.success == true) {
                        this.props.onHistory.push({ pathname: "/" });
                    }
                }).catch((err) => {
                    console.log("err");
                });
            }
        }
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
                        {
                            this.state.emailDetail.length != 0 ?

                                <div className="mail-details-header mb-3">
                                    <div className="row">
                                        {/* <div className="col-3" style={{ maxWidth: 80 }}>
                                    <div className="round-circle">

                                    </div>
                                </div> */}
                                        <div className="col-9">
                                            <h2>{this.state.emailDetail.header.subject[0]}</h2>
                                            <p className="mb-0"><span>from: </span> <a href="javascript:void(0)">{(this.state.emailDetail.header.from[0]).split("<")[0]}</a></p>
                                            {/* <p><span>to: </span> <a href="javascript:void(0)">{this.state.emailDetail.header.to[0]}</a></p> */}
                                            {/* <p><span>Date: </span> <a href="javascript:void(0)">{this.state.emailDetail.header.date[0]}</a></p> */}
                                        </div>
                                        <div className="col-3">
                                            {/* <p className="mb-0 text-right mb-2 d-block"><span>Date: {this.state.emailDetail.header.date[0].split(" ")[0] + " " + this.state.emailDetail.header.date[0].split(" ")[1] + " " + this.state.emailDetail.header.date[0].split(" ")[2] + " " + this.state.emailDetail.header.date[0].split(" ")[3]}</span></p> */}
                                            <p className="mb-0 text-right mb-2 d-block">
                                                <span>
                                                    Date:
                                                {
                                                        momentone(this.state.emailDetail.header.date[0].split(" ")[1] + "/" + months[this.state.emailDetail.header.date[0].split(" ")[2]] + "/" + this.state.emailDetail.header.date[0].split(" ")[3] + " " + this.state.emailDetail.header.date[0].split(" ")[4], 'DD/MM/YYYY HH:mm:ss').tz(currentTimezone).format('DD')
                                                        + " " + monthNames[momentone(this.state.emailDetail.header.date[0].split(" ")[1] + "/" + months[this.state.emailDetail.header.date[0].split(" ")[2]] + "/" + this.state.emailDetail.header.date[0].split(" ")[3] + " " + this.state.emailDetail.header.date[0].split(" ")[4], 'DD/MM/YYYY HH:mm:ss').tz(currentTimezone).format('MM')]
                                                        + ", " + momentone(this.state.emailDetail.header.date[0].split(" ")[1] + "/" + months[this.state.emailDetail.header.date[0].split(" ")[2]] + "/" + this.state.emailDetail.header.date[0].split(" ")[3] + " " + this.state.emailDetail.header.date[0].split(" ")[4], 'DD/MM/YYYY HH:mm:ss').tz(currentTimezone).format('YYYY') +
                                                        " " + momentone(this.state.emailDetail.header.date[0].split(" ")[1] + "/" + months[this.state.emailDetail.header.date[0].split(" ")[2]] + "/" + this.state.emailDetail.header.date[0].split(" ")[3] + " " + this.state.emailDetail.header.date[0].split(" ")[4], 'DD/MM/YYYY HH:mm:ss').tz(currentTimezone).format('HH')
                                                        + ":" + momentone(this.state.emailDetail.header.date[0].split(" ")[1] + "/" + months[this.state.emailDetail.header.date[0].split(" ")[2]] + "/" + this.state.emailDetail.header.date[0].split(" ")[3] + " " + this.state.emailDetail.header.date[0].split(" ")[4], 'DD/MM/YYYY HH:mm:ss').tz(currentTimezone).format('mm')
                                                    }
                                                </span></p>
                                            {
                                                this.state.emailDetail.length != 0 && this.state.emailDetail.flag == 0 ?
                                                    <a href="javascript:void(0)" className="text-right d-block">
                                                        <i className="fa fa-star-o" onClick={() => this.markMailAsFavourite(this.state.emailDetail.uid, this.state.emailDetail.seqno)} />
                                                    </a>
                                                    :
                                                    <a href="javascript:void(0)" className="text-right d-block">
                                                        <i className="fa fa-star" onClick={() => this.removeMailAsFavourite(this.state.emailDetail.uid, this.state.emailDetail.seqno)} />
                                                    </a>
                                            }
                                            <p className="text-right"><button onClick={() => this.deleteEmail()} class="btn btn-secondary">Delete</button></p>
                                        </div>
                                    </div>
                                </div> : ''

                        }


                        <div className="mail-cards mail-details">
                            <div className="row">
                                <Tabs className="w-100 cust-tab" onSelect={(label, index) => this.getSelectedTab(label, index)}>
                                    <Tab label="Email ScreenShot">
                                        {this.displayScreenshot()}
                                    </Tab>
                                    <Tab label="Email HTML">
                                        {this.displayMail()}
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default EmailDetails;