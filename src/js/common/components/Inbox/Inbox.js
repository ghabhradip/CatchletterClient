import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import _imageURL from '../../_imageURL';
import qs from 'simple-query-string';
import {
    getListOfMailsByUserId,
    getWebsitesListByUserId,
    removeMailAsFavouriteId,
    markMailAsFavourite,
    getWebsiteTags,
    getFavouriteMailsByDate,
    getFavouriteMailsByDateForAllWebsites,
    getListOfMailsByWebsite,
    getListOfMailsByUserIdWithPagination,
    getwebsitebydatecheck,
    postGrid,
    getGridType,
    getBillingData
} from '../../../api/commonApi';
import EmailDetails from '../EmailDetails/EmailDetails';
import BillingExpire from '../BillingExpire/BillingExpire';
import { DateRange } from 'react-date-range';
import moment from 'moment';

import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Login from '../Login/Login';
import { simpleParser } from 'mailparser';
import ReactList from 'react-list';
import Pagination from "react-js-pagination";

// import loadAccount from 'my-account-loader';

let IsLoggedIn = false;

class Inbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favoutiteEmails: [],
            websiteList: [],
            website_name: '',
            allWebsite: [],
            Tags: [],
            tags: '',
            inputText: '',
            totalItemsData: [],
            IsShowDatePicker: false,
            date: '',
            sDate: '',
            eDate: '',
            isLength: false,
            pageNumber: 1,
            totalItemsCount: 0,
            displayType: 'row',
            listViewButton: 'btn',
            gridViewButton: 'btn active',
            initialTotalItemCount: '',
            selectedEmailDomain: '',
            selectedUniqueId: '',
            gridVisible: false,
            listVisible: true,
            billingExpiryValue: '',
            expireMessage: '',
            selectedWebsiteId: '',
            hideButtonDate: true
        };
        if (localStorage.getItem("catchLetterDetails")) {
            IsLoggedIn = true;
        }

        if (IsLoggedIn == false) {
            this.props.onHistory.push({ pathname: '/' });
        }
    }


    handleDate() {
        this.setState({
            IsShowDatePicker: true,
            date: '',
            hideButtonDate: false
        })
    }

    componentDidMount() {

        window.scrollTo(0, 0);
        let messageOne;
        localStorage.removeItem("emailDomain&Id");
        localStorage.removeItem("date");

        if (localStorage.getItem("catchLetterDetails")) {
            let value = JSON.parse(localStorage.getItem("catchLetterDetails"));

            if (value) {

                const valueOne = {
                    current_date: new Date(),
                    userId: value._id
                };
                getwebsitebydatecheck(valueOne).then((res) => {
                    if (res.data.success == true) {
                        const message = res.data.data.message;
                        if (message == "You are within billing date.") {

                            /** call rest apis */

                            // billing data
                            // const billingData = {
                            //     userId: value._id
                            // };
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

                            /** getting all emails */

                            const url = this.props.onHistory.location.search;
                            if (url) {
                                const parsed = qs.parse(this.props.onHistory.location.search);
                                let data = {};

                                if (parsed.userId.split("websiteId=")[0] && parsed.userId.split("websiteId=")[1].split("fromDate=")[0] && parsed.userId.split("websiteId=")[1].split("fromDate=")[1].split("endDate=")[0] && parsed.userId.split("websiteId=")[1].split("fromDate=")[1].split("endDate=")[1].split("websiteName=")[0] && parsed.userId.split("websiteId=")[1].split("fromDate=")[1].split("endDate=")[1].split("websiteName=")[1]) {

                                    data.id = new Buffer(parsed.userId.split("websiteId=")[0], 'base64').toString('ascii');
                                    data.websiteId = new Buffer(parsed.userId.split("websiteId=")[1].split("fromDate=")[0], 'base64').toString('ascii');
                                    data.fromDate = parsed.userId.split("websiteId=")[1].split("fromDate=")[1].split("endDate=")[0];
                                    data.toDate = parsed.userId.split("websiteId=")[1].split("fromDate=")[1].split("endDate=")[1].split("websiteName=")[0];
                                    data.page = this.state.pageNumber;

                                    getListOfMailsByUserIdWithPagination(data).then((res) => {
                                        if (res.data.success == true) {
                                            for (let i = 0; i < res.data.data.message.length; i++) {
                                                // res.data.data.message[i].imageUrl = "http://178.128.176.48:7000/resources/screenshots_" + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                                                res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                                            }
                                            this.setState({
                                                favoutiteEmails: res.data.data.message,
                                                totalItemsData: res.data.data.message,
                                                allWebsite: res.data.data.message,
                                                totalItemsCount: res.data.data.totalCount,
                                                initialTotalItemCount: res.data.data.totalCount,
                                                date: parsed.userId.split("websiteId=")[1].split("fromDate=")[1].split("endDate=")[0] + "-" + parsed.userId.split("websiteId=")[1].split("fromDate=")[1].split("endDate=")[1].split("websiteName=")[0],
                                                website_name: parsed.userId.split("websiteId=")[1].split("fromDate=")[1].split("endDate=")[1].split("websiteName=")[1],
                                                sDate: parsed.userId.split("websiteId=")[1].split("fromDate=")[1].split("endDate=")[0],
                                                eDate: parsed.userId.split("websiteId=")[1].split("fromDate=")[1].split("endDate=")[1]
                                            });

                                            this.setState({
                                                isLength: true
                                            });
                                        }
                                    }).catch((err) => {
                                        this.setState({
                                            isLength: true
                                        });

                                    });
                                }

                            }
                            else {
                                const data = {
                                    id: value._id,
                                    page: this.state.pageNumber
                                };
                                getListOfMailsByUserIdWithPagination(data).then((res) => {
                                    if (res.data.success == true) {
                                        for (let i = 0; i < res.data.data.message.length; i++) {
                                            // res.data.data.message[i].imageUrl = "http://178.128.176.48:7000/resources/screenshots_" + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                                            res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                                        }
                                        this.setState({
                                            favoutiteEmails: res.data.data.message,
                                            totalItemsData: res.data.data.message,
                                            allWebsite: res.data.data.message,
                                            totalItemsCount: res.data.data.totalCount,
                                            initialTotalItemCount: res.data.data.totalCount
                                        });

                                        this.setState({
                                            isLength: true
                                        });
                                    }
                                }).catch((err) => {
                                    this.setState({
                                        isLength: true
                                    });

                                });
                            }


                            /** getting  all websites */
                            getWebsitesListByUserId(value._id).then((res) => {

                                if (res.data.success == true) {
                                    this.setState({
                                        websiteList: res.data.data.websiteList
                                    });
                                }
                            }).catch((error) => {

                                // NotificationManager.error("Please try again later.", "Error");
                            });

                            /** getting all tags */
                            getWebsiteTags(value._id).then((tags) => {

                                if (tags.data.success == true) {
                                    this.setState({
                                        Tags: tags.data.data
                                    });
                                }
                            }).catch((error) => {

                                // NotificationManager.error("Please try again later.", "Error");
                            });

                            const dataNewOne = {
                                user_id: value._id
                            };
                            getGridType(dataNewOne).then((res6) => {
                                if (res6.data.success == true) {
                                    const valueNew = res6.data.data.details[0].type;

                                    if (valueNew == "grid") {
                                        this.setState({
                                            displayType: 'row',
                                            listViewButton: 'btn',
                                            gridViewButton: 'btn active',
                                            listVisible: true,
                                            gridVisible: false
                                        });
                                    } else if (valueNew == "list") {
                                        this.setState({
                                            displayType: '',
                                            listViewButton: 'btn active',
                                            gridViewButton: 'btn',
                                            listVisible: false,
                                            gridVisible: true
                                        });
                                    }
                                }
                            }).catch((error) => {

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

    /** save value to state */
    handleInputChange(event) {
        var change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
    }



    // handleChange(event) {
    //     var change = {};
    //     change[event.target.name] = event.target.value;
    //     this.setState(change);
    //     let requestBody = {};
    //     if (event.target.name == "website_name") {

    //         this.setState({
    //             isLength: false
    //         });
    //         if (this.state.tags && this.state.tags != "alltags") {
    //             requestBody.tags = this.state.tags;
    //         }
    //         if (this.state.inputText) {
    //             requestBody.subject = this.state.inputText;
    //         }
    //         if (this.state.sDate && this.state.eDate) {
    //             requestBody.fromDate = this.state.sDate;
    //             requestBody.toDate = this.state.eDate;
    //         }
    //         if (event.target.value == "allWebsite") {
    //             let value = JSON.parse(localStorage.getItem("catchLetterDetails"));

    //             requestBody.id = value._id;
    //             this.setState({
    //                 selectedEmailDomain: '',
    //                 selectedUniqueId: '',
    //                 selectedWebsiteId: ''
    //             })

    //         } else {
    //             let emailDomain;
    //             let unique_id;
    //             let websiteId;
    //             const toCompare = event.target.value;
    //             this.state.websiteList.map((item) => {
    //                 if (item.website_name == toCompare) {
    //                     emailDomain = item.emailDomain;
    //                     unique_id = item.unique_id;
    //                     websiteId = item._id
    //                 }
    //             });
    //             this.setState({
    //                 selectedEmailDomain: emailDomain,
    //                 selectedUniqueId: unique_id,
    //                 selectedWebsiteId: websiteId
    //             })
    //             // requestBody.emailDomain = emailDomain;
    //             // requestBody.unique_id = unique_id;
    //             requestBody.websiteId = websiteId;
    //         }
    //         getListOfMailsByUserIdWithPagination(requestBody).then((res) => {
    //             this.setState({
    //                 isLength: true
    //             });
    //             if (res.data.success == true) {
    //                 for (let i = 0; i < res.data.data.message.length; i++) {
    //                     res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
    //                 }
    //                 this.setState({
    //                     favoutiteEmails: res.data.data.message,
    //                     totalItemsCount: res.data.data.totalCount
    //                 });

    //             }
    //             else {

    //                 this.setState({
    //                     favoutiteEmails: [],
    //                     isLength: true
    //                 })
    //                 NotificationManager.error("Please try again later.", "Error");
    //             }

    //         }).catch((Err) => {

    //             this.setState({
    //                 isLength: true
    //             })
    //             NotificationManager.error("Please try again later.", "Error");
    //         })

    //     }
    // }


    handleChange(event) {
        var change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
        this.setState({
            selectedWesbite: event.target.value
        })
        let requestBody = {};
        if (event.target.name == "website_name") {


            this.setState({
                isLength: false
            });
            if (this.state.tags && this.state.tags != "alltags") {
                requestBody.tags = this.state.tags;
            }
            if (this.state.inputText) {
                requestBody.subject = this.state.inputText;
            }
            if (this.state.sDate && this.state.eDate) {
                requestBody.fromDate = this.state.sDate;
                requestBody.toDate = this.state.eDate;
            }
            if (event.target.value == "allWebsite") {

                let value = JSON.parse(localStorage.getItem("catchLetterDetails"));

                requestBody.id = value._id;
                // this.setState({
                //     selectedEmailDomain: '',
                //     selectedUniqueId: '',
                //     monthlyLineData: '',
                //     selectedWesbite: '',
                //     hiddenTotalGraph: false,
                //     hiddenPerticularGraph: true
                // });
                this.setState({
                    hiddenTotalGraph: false,
                    hiddenPerticularGraph: true
                });

            } else {
                let emailDomain;
                let unique_id;
                const toCompare = event.target.value;
                this.state.websiteList.map((item) => {
                    if (item.website_name == toCompare) {
                        emailDomain = item.emailDomain;
                        unique_id = item.unique_id;
                    }
                });
                this.setState({
                    selectedEmailDomain: emailDomain,
                    selectedUniqueId: unique_id,
                    // hiddenTotalGraph: true,
                    // hiddenPerticularGraph: false
                })
                requestBody.emailDomain = emailDomain;
                requestBody.unique_id = unique_id;
                // this.getNoOfMailsByWebsite(emailDomain, unique_id);
            }

            getListOfMailsByUserIdWithPagination(requestBody).then((res) => {
                this.setState({
                    isLength: true
                });
                if (res.data.success == true) {
                    for (let i = 0; i < res.data.data.message.length; i++) {
                        res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                    }
                    this.setState({
                        favoutiteEmails: res.data.data.message,
                        totalItemsCount: res.data.data.totalCount
                    });



                } else {

                    this.setState({
                        favoutiteEmails: [],
                        isLength: true
                    })
                }

            }).catch((error) => {

                this.setState({
                    isLength: true,
                    favoutiteEmails: []
                })
            });

        }
    }

    handlePageChange(pageNumber) {

        let requestBody = {};
        this.setState({ pageNumber: pageNumber });

        if (localStorage.getItem("catchLetterDetails")) {
            let value = JSON.parse(localStorage.getItem("catchLetterDetails"));
            requestBody.id = value._id;
        }

        if (this.state.inputText) {
            requestBody.subject = this.state.inputText;
        }
        // if (this.state.selectedEmailDomain) {
        //     requestBody.emailDomain = this.state.selectedEmailDomain;
        //     requestBody.unique_id = this.state.selectedUniqueId;
        // }
        if (this.state.selectedWebsiteId) {
            requestBody.websiteId = this.state.selectedWebsiteId;
        }
        if (this.state.sDate && this.state.eDate) {
            requestBody.fromDate = this.state.sDate;
            requestBody.toDate = this.state.eDate;
        }
        if (this.state.tags) {
            requestBody.tags = this.state.tags;
        }
        requestBody.page = pageNumber;

        getListOfMailsByUserIdWithPagination(requestBody).then((res) => {
            if (res.data.success == true) {
                for (let i = 0; i < res.data.data.message.length; i++) {
                    res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                }
                this.setState({
                    favoutiteEmails: res.data.data.message
                });

                this.setState({
                    isLength: true
                });
            }
            else {

                this.setState({
                    favoutiteEmails: []
                });
                NotificationManager.error(res.data.data.message, "Error");
            }
        }).catch((err) => {

            this.setState({
                favoutiteEmails: []
            });
            NotificationManager.error(err.response.data.data, "Error");
        });
    }



    // handleTagsChange(event) {
    //     var change = {};
    //     change[event.target.name] = event.target.value;
    //     this.setState(change);
    //     let requestBody = {};

    //     this.setState({
    //         isLength: false
    //     });
    //     if (event.target.name == "tags") {
    //         let value = JSON.parse(localStorage.getItem("catchLetterDetails"));

    //         requestBody.id = value._id;
    //         if (this.state.inputText) {
    //             requestBody.subject = this.state.inputText;
    //         }
    //         if (this.state.selectedWebsiteId) {
    //             requestBody.websiteId = this.state.selectedWebsiteId;
    //         }
    //         if (this.state.sDate && this.state.eDate) {
    //             requestBody.fromDate = this.state.sDate;
    //             requestBody.toDate = this.state.eDate;
    //         }
    //         if (event.target.value == "alltags") {

    //         } else {
    //             requestBody.tags = event.target.value;
    //         }

    //         getListOfMailsByUserIdWithPagination(requestBody).then((res) => {
    //             this.setState({
    //                 isLength: true
    //             });
    //             if (res.data.success == true) {
    //                 for (let i = 0; i < res.data.data.message.length; i++) {
    //                     res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
    //                 }
    //                 this.setState({
    //                     favoutiteEmails: res.data.data.message,
    //                     totalItemsCount: res.data.data.totalCount
    //                 });

    //             }
    //             else {

    //                 this.setState({
    //                     favoutiteEmails: [],
    //                     isLength: true
    //                 })
    //                 NotificationManager.error("Please try again later.", "Error");
    //             }

    //         }).catch((Err) => {

    //             this.setState({
    //                 isLength: true
    //             })
    //             NotificationManager.error("Please try again later.", "Error");
    //         });
    //     }
    // }



    handleTagsChange(event) {
        var change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
        let requestBody = {};
        this.setState({
            isLength: false
        });
        if (event.target.name == "tags") {
            let value = JSON.parse(localStorage.getItem("catchLetterDetails"));

            requestBody.id = value._id;
            if (this.state.inputText) {
                requestBody.subject = this.state.inputText;
            }
            if (this.state.selectedEmailDomain) {
                requestBody.emailDomain = this.state.selectedEmailDomain;
                requestBody.unique_id = this.state.selectedUniqueId;
            }
            if (this.state.sDate && this.state.eDate) {
                requestBody.fromDate = this.state.sDate;
                requestBody.toDate = this.state.eDate;
            }
            if (event.target.value == "alltags") {

            } else {
                requestBody.tags = event.target.value;
            }

            getListOfMailsByUserIdWithPagination(requestBody).then((res) => {
                this.setState({
                    isLength: true
                });
                if (res.data.success == true) {
                    for (let i = 0; i < res.data.data.message.length; i++) {
                        res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                    }
                    this.setState({
                        favoutiteEmails: res.data.data.message,
                        totalItemsCount: res.data.data.totalCount
                    });


                } else {

                    this.setState({
                        favoutiteEmails: [],
                        isLength: true
                    });
                }

            }).catch((Err) => {

                this.setState({
                    isLength: true,
                    favoutiteEmails: []
                });
            });

        }
    }



    renderFavouriteEmails() {
        if (this.state.favoutiteEmails.length != 0) {
            return this.state.favoutiteEmails.map((res, index) => (
                <div className="col-12 col-md-6 col-lg-3" key={index}>
                    <div className="card shadow">
                        {
                            res.header && res.header.date && res.header.from && res.header.subject && res.header.to ?
                                <div className="card-header">
                                    <h2><a href="javascript:void(0)" onClick={() => this.showMail(res.emailDomain, res.unique_id, res.uid, res._id)}>{res.header.subject[0]}</a></h2>
                                    <p><span>from: </span> <a href="javascriptdisplaySubscriptionPlan:void(0)" onClick={() => this.showMail(res.emailDomain, res.unique_id, res.uid, res._id)}>{(res.header.from[0]).split("<")[0]}</a></p>
                                    {/* <p><span>to: </span> <a href="javascript:void(0)">{res.header.to[0]}</a></p> */}
                                    <p><span>Sent: </span> <a href="javascript:void(0)">{res.header.date[0].split(" ")[0] + " " + res.header.date[0].split(" ")[1] + " " + res.header.date[0].split(" ")[2] + " " + res.header.date[0].split(" ")[3] + " " + res.header.date[0].split(" ")[4]}</a></p>
                                    {
                                        res && res.flag == 0 ?
                                            <a href="javascript:void(0)" className="star-ml">
                                                <i className="fa fa-star-o" onClick={() => this.markMailAsFavourite(res.emailDomain, res.unique_id, res.uid, res.seqno)} />
                                            </a>
                                            :
                                            <a href="javascript:void(0)" className="star-ml">
                                                <i className="fa fa-star" onClick={() => this.removeMailAsFavourite(res.emailDomain, res.unique_id, res.uid, res.seqno)} />
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
                            <a href="javascript:void(0)" className="text-primary float-right" onClick={() => this.showMail(res.emailDomain, res.unique_id, res.uid, res._id)}> View Email </a>
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
                <div className="no-image">
                    <img src={require('../../../../assets/images/star-image.png')} className="img-fluid mb-3" />
                    <h2 className="mb-3">No emails yet!</h2>


                </div>
            )
        }
    }

    markMailAsFavourite(emailDomain, unique_id, value, seqno) {
        const data = {
            emailDomain: emailDomain,
            unique_id: unique_id,
            id: JSON.stringify(value),
            user_id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
            seqno: JSON.stringify(value)
        };

        let toChangeEmailArray = this.state.favoutiteEmails;
        toChangeEmailArray.map((item) => {
            if (item.uid == value && item.emailDomain == emailDomain) {
                item.flag = 1;
            }
        });
        this.setState({ favoutiteEmails: toChangeEmailArray });

        markMailAsFavourite(data).then((res) => {

            if (res.data.success == true) {

            }
        }).catch((error) => {

            NotificationManager.error("Please try again later.", "Error");
        });
    }

    removeMailAsFavourite(emailDomain, unique_id, value, seqno) {
        const data = {
            emailDomain: emailDomain,
            unique_id: unique_id,
            id: JSON.stringify(value),
            seqno: JSON.stringify(value)
        };

        let toChangeEmailArray = this.state.favoutiteEmails;
        toChangeEmailArray.map((item) => {
            if (item.uid == value && item.emailDomain == emailDomain) {
                item.flag = 0;
            }
        });
        this.setState({ favoutiteEmails: toChangeEmailArray });
        removeMailAsFavouriteId(data).then((res) => {

            if (res.data.success == true) {

            }
        }).catch((error) => {

            NotificationManager.error("Please try again later.", "Error");
        });
    }

    showMail(emailDomain, unique_id, value, emailId) {
        let userId = JSON.parse(localStorage.getItem("catchLetterDetails"))._id;
        const data = {
            emailDomain: emailDomain,
            unique_id: unique_id,
            id: JSON.stringify(value),
            user_id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
            emailId: emailId
        };
        this.props.onHistory.push({ pathname: "/emailDetail/" + btoa(userId), value: data });
    }

    searchMails() {

        this.setState({
            isLength: false
        });
        let requestBody = {};
        requestBody.id = JSON.parse(localStorage.getItem("catchLetterDetails"))._id;
        if (this.state.selectedWebsiteId) {
            requestBody.websiteId = this.state.selectedWebsiteId;
        }
        if (this.state.sDate && this.state.eDate) {
            requestBody.fromDate = this.state.sDate;
            requestBody.toDate = this.state.eDate;
        }
        if (this.state.inputText) {
            requestBody.subject = this.state.inputText;
        }
        if (this.state.tags && this.state.tags != "alltags") {
            requestBody.tags = this.state.tags;
        }
        getListOfMailsByUserIdWithPagination(requestBody).then((res) => {
            this.setState({
                isLength: true
            });
            if (res.data.success == true) {
                for (let i = 0; i < res.data.data.message.length; i++) {
                    res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                }
                this.setState({
                    favoutiteEmails: res.data.data.message,
                    totalItemsCount: res.data.data.totalCount
                });

            }
            else {

                this.setState({
                    favoutiteEmails: [],
                    isLength: true
                })
                NotificationManager.error("Please try again later.", "Error");
            }

        }).catch((Err) => {

            this.setState({
                isLength: true
            })
            NotificationManager.error("Please try again later.", "Error");
        })

    }

    handleSelect(range) {
        let newStartMonth;
        let newEndMonth;

        if (range.startDate != range.endDate) {

        }

        let startDateYear = range.startDate.year();
        let startDateMonth = range.startDate.month();
        let startDateDay = range.startDate.date();

        let endDateYear = range.endDate.year();
        let endDateMonth = range.endDate.month();
        let endDateDay = range.endDate.date();

        if (startDateMonth < 10) {
            newStartMonth = "0" + (startDateMonth + 1);
        }

        if (startDateMonth >= 10) {
            newStartMonth = (startDateMonth + 1);
        }

        if (endDateMonth < 10) {
            newEndMonth = "0" + (endDateMonth + 1);
        }

        if (endDateMonth >= 10) {
            newEndMonth = (endDateMonth + 1);
        }

        let startDate = startDateDay + "/" + newStartMonth + "/" + startDateYear;
        let endDate = endDateDay + "/" + newEndMonth + "/" + endDateYear;
        if (startDate != endDate) {
            this.setState({
                IsShowDatePicker: false,
                date: startDate + "-" + endDate
            });

            if (startDate && endDate) {
                this.setState({
                    sDate: startDate,
                    eDate: endDate,
                    hideButtonDate: true
                });

                this.setState({
                    isLength: false
                });
                // const data = {
                //     startDate: startDate,
                //     endDate: endDate
                // };
                let requestBody = {};
                requestBody.fromDate = startDate;
                requestBody.toDate = endDate;
                requestBody.id = JSON.parse(localStorage.getItem("catchLetterDetails"))._id;
                if (this.state.selectedWebsiteId) {
                    requestBody.websiteId = this.state.selectedWebsiteId;
                }
                if (this.state.tags && this.state.tags != "alltags") {
                    requestBody.tags = this.state.tags;
                }
                if (this.state.inputText) {
                    requestBody.subject = this.state.inputText;
                }

                getListOfMailsByUserIdWithPagination(requestBody).then((res) => {
                    this.setState({
                        isLength: true
                    });
                    if (res.data.success == true) {
                        for (let i = 0; i < res.data.data.message.length; i++) {
                            res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                        }
                        this.setState({
                            favoutiteEmails: res.data.data.message,
                            totalItemsCount: res.data.data.totalCount
                        });

                    }
                    else {

                        this.setState({
                            favoutiteEmails: [],
                            isLength: true
                        })
                        NotificationManager.error("Please try again later.", "Error");
                    }

                }).catch((Err) => {

                    this.setState({
                        isLength: true
                    })
                    NotificationManager.error("Please try again later.", "Error");
                })

            }

        }

    }

    listView() {
        if (localStorage.getItem("catchLetterDetails")) {
            const data = {
                user_id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
                type: "list"
            };
            postGrid(data).then((res) => {

            }).catch((error) => {

            });
            this.setState({
                displayType: '',
                listViewButton: 'btn active',
                gridViewButton: 'btn',
                listVisible: false,
                gridVisible: true
            });
        }
    }

    gridView() {
        if (localStorage.getItem("catchLetterDetails")) {
            const data = {
                user_id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
                type: "grid"
            };
            postGrid(data).then((res) => {

            }).catch((error) => {

            });
            this.setState({
                displayType: 'row',
                listViewButton: 'btn',
                gridViewButton: 'btn active',
                listVisible: true,
                gridVisible: false
            });
        }
    }

    showListView() {
        if (this.state.favoutiteEmails.length != 0) {
            return this.state.favoutiteEmails.map((res, index) => (

                <div className="col-12 col-lg-6" key={index}>
                    <div className="card shadow">
                        {
                            res.header && res.header.date && res.header.from && res.header.subject && res.header.to ?


                                <div className="card-header list-view">

                                    <div className="row">
                                        <div className="col-md-9">
                                            <h2><a href="javascript:void(0)" onClick={() => this.showMail(res.emailDomain, res.unique_id, res.uid, res._id)}>{res.header.subject[0]}</a></h2>
                                            <p><span>from: </span> <a href="javascript:void(0)" onClick={() => this.showMail(res.emailDomain, res.unique_id, res.uid, res._id)}>{(res.header.from[0]).split("<")[0]}</a></p>
                                            {/* <p><span>to: </span> <a href="javascript:void(0)">{res.header.to[0]}</a></p> */}
                                            <p><span>Sent: </span> <a href="javascript:void(0)">{res.header.date[0].split(" ")[0] + " " + res.header.date[0].split(" ")[1] + " " + res.header.date[0].split(" ")[2] + " " + res.header.date[0].split(" ")[3] + " " + res.header.date[0].split(" ")[4]}</a></p>


                                        </div>
                                        <div className="col-md-3">
                                            {
                                                res && res.flag == 0 ?
                                                    <a href="javascript:void(0)" className="star-ml">
                                                        <i className="fa fa-star-o" onClick={() => this.markMailAsFavourite(res.emailDomain, res.unique_id, res.uid, res.seqno)} />
                                                    </a>
                                                    :
                                                    <a href="javascript:void(0)" className="star-ml">
                                                        <i className="fa fa-star" onClick={() => this.removeMailAsFavourite(res.emailDomain, res.unique_id, res.uid, res.seqno)} />
                                                    </a>
                                            }
                                            <a href="javascript:void(0)" className="text-primary mt-3 float-right" onClick={() => this.showMail(res.emailDomain, res.unique_id, res.uid, res._id)}> View Email </a>
                                        </div>
                                    </div>
                                </div>
                                :
                                <h2>Header not specified.</h2>
                        }
                    </div>
                </div>
            ));
        }
        else if (this.state.isLength == false) {
            return <div className="p-4"><h3>Loading...</h3></div>
        }
        else {
            return (
                <div className="no-image">
                    <img src={require('../../../../assets/images/star-image.png')} className="img-fluid mb-3" />
                    <h2 className="mb-3">No emails yet!</h2>
                </div>
            )
        }
    }

    goPaymentPage() {
        this.props.onHistory.push({ pathname: "/billing" });
    }

    closeDatePicker() {
        this.setState({
            IsShowDatePicker: false,
            hideButtonDate: true
        });
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
                        <div className="top-h mb-4">
                            <div className="row">
                                <div className="col-md-8">
                                    <h1>Inbox</h1>
                                </div>
                                <div className="col-md-4">
                                    <div id="btnContainer" className="list-grid">
                                        <button className={this.state.listViewButton} onClick={() => this.listView()}><i className="fa fa-bars"></i></button>
                                        <button className={this.state.gridViewButton} onClick={() => this.gridView()}><i className="fa fa-th-large"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* <div className="filter-bar py-2 mb-4">
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="f-bx">
                                    {
                                        this.state.IsShowDatePicker ? (
                                            <DateRange
                                                calendars={1}
                                                onChange={this.handleSelect.bind(this)}
                                                maxDate={moment().add('days', 1)}
                                                startDate={this.state.sDate}
                                                endDate={this.state.eDate}
                                            />
                                        ) : (
                                                <input type="text" className="form-control" placeholder="Enter Date" onFocus={this.handleDate.bind(this)} value={this.state.date} />
                                            )
                                    }


                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="f-bx">
                                    <select className="form-control" name="website_name" onChange={this.handleChange.bind(this)}>
                                        <option value="allWebsite">All Websites</option>
                                        {
                                            this.state.websiteList.length != 0 ? this.state.websiteList.map((result, i) =>
                                                <option key={i} value={result.website_name}>{result.website_name}</option>
                                            ) : (
                                                    ''
                                                )
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="f-bx">
                                    <select className="form-control" name="tags" onChange={this.handleTagsChange.bind(this)}>
                                        <option value="alltags">All Websites Tags</option>
                                        {
                                            this.state.Tags.length != 0 ? this.state.Tags.map((result, i) =>
                                                <option key={i} value={result.text}>{result.text}</option>
                                            ) : (
                                                    ''
                                                )
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="input-box clearfix">
                                    <input id="search" name="inputText" placeholder="Search subject" className="input-field" onChange={this.handleInputChange.bind(this)} value={this.state.inputText} />
                                    <button className="right-btn" type="submit" onClick={() => this.searchMails()}> <i className="fa fa-search" /></button>
                                </div>
                            </div>
                        </div>
                    </div> */}

                        <div className="filter-bar py-3 mb-3">
                            <div className="row">
                                <div className="col-12 col-md-6 col-lg-3 col-cal-input">
                                    <div className="f-bx input-box" style={{ overflow: 'hidden' }}>
                                        <button hidden={this.state.hideButtonDate} onClick={() => this.closeDatePicker()} class="btn btn-primary btn-sm btn-calender-close"><i class="fa fa-close"></i></button>
                                        {
                                            this.state.IsShowDatePicker ? (
                                                <DateRange
                                                    // onInit={this.handleSelect}
                                                    calendars={1}
                                                    onChange={this.handleSelect.bind(this)}
                                                    maxDate={moment().add('days', 1)}
                                                    startDate={this.state.sDate}
                                                    endDate={this.state.eDate}
                                                />
                                            ) : (
                                                    <div>
                                                        <input type="text" className="form-control" placeholder="Enter Date" onFocus={this.handleDate.bind(this)} value={this.state.date} />
                                                        <button className="right-btn" type="submit"> <i className="fa fa-calendar"></i></button>
                                                    </div>
                                                )
                                        }


                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-3">
                                    <div className="f-bx input-box">
                                        <select className="form-control" name="website_name" onChange={this.handleChange.bind(this)} value={this.state.website_name}>
                                            <option value="allWebsite">All Websites</option>
                                            {
                                                this.state.websiteList.length != 0 ? this.state.websiteList.map((result, i) =>
                                                    <option key={i} value={result.website_name}>{result.website_name}</option>
                                                ) : (
                                                        ''
                                                    )
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-3">
                                    <div className="f-bx input-box">
                                        <select className="form-control" name="tags" onChange={this.handleTagsChange.bind(this)}>
                                            <option value="alltags">All Websites Tags</option>
                                            {
                                                this.state.Tags.length != 0 ? this.state.Tags.map((result, i) =>
                                                    <option key={i} value={result.text}>{result.text}</option>
                                                ) : (
                                                        ''
                                                    )
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-3">
                                    <div className="input-box clearfix">
                                        <input id="search" name="inputText" placeholder="Search subject" className="input-field" onChange={this.handleInputChange.bind(this)} value={this.state.inputText} />
                                        <button className="right-btn" type="submit" onClick={() => this.searchMails()}> <i className="fa fa-search" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/*end of filter bar*/}

                        {/** grid view */}
                        <div className="mail-cards new-mail-cards" hidden={this.state.gridVisible}>
                            <div className="row">
                                {this.renderFavouriteEmails()}
                            </div>
                        </div>

                        {/** list view */}
                        {/* <div className="table-view" hidden={this.state.listVisible}>
                        {this.showListView()}
                    </div> */}

                        <div className="mail-cards listview" hidden={this.state.listVisible}>
                            <div className="row">
                                {this.showListView()}
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
                </section >
            </div>
        )
    }
}

export default Inbox;