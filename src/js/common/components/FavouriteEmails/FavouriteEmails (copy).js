import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { simpleParser } from 'mailparser';
import {
    getListOfFavouritesByUserId,
    getWebsitesListByUserId,
    getFavouriteOnPerticular,
    removeMailAsFavouriteId,
    markMailAsFavourite,
    getWebsiteTags,
    getFavouriteMailsByDate,
    getFavouriteMailsByDateForAllWebsites
} from '../../../api/commonApi';
import EmailDetails from '../EmailDetails/EmailDetails';
import { DateRange } from 'react-date-range';
import moment from 'moment';

import Login from '../Login/Login';
import _imageURL from '../../_imageURL';
import Pagination from "react-js-pagination";

import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

let IsLoggedIn = false;

class FavouriteEmails extends Component {
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
            totalItemsCount: 0
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
            date: ''
        })
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        localStorage.removeItem("emailDomain&Id");
        localStorage.removeItem("date");

        if (localStorage.getItem("catchLetterDetails")) {
            let value = JSON.parse(localStorage.getItem("catchLetterDetails"));
            if (value) {
                /** getting favourite emails */
                getListOfFavouritesByUserId(value._id, this.state.pageNumber).then((res3) => {
                    if (res3) {
                        // this.setState({
                        //     favoutiteEmails: res3.data.data.message,
                        //     allWebsite: res3.data.data.message,
                        //     totalItemsData: res3.data.data.message
                        // });
                        // const that=this;
                        // (async function loop() {
                        //     for (let i = 0; i < res3.data.data.message.length; i++) {
                        //         await new Promise(resolve => {
                        //             simpleParser(res3.data.data.message[i].buffer, (err, parsed) => {
                        //                 if(parsed.html)
                        //                 res3.data.data.message[i].htmlData=parsed.html
                        //                 else
                        //                 res3.data.data.message[i].htmlData = res3.data.data.message[i].body;
                        //                  resolve(parsed);
                        //             });

                        //         });
                        //         console.log(i);

                        //     }
                        //     that.setState({
                        //         favoutiteEmails: res3.data.data.message,
                        //         allWebsite: res3.data.data.message,
                        //         totalItemsData: res3.data.data.message
                        //     });

                        // })();
                        for (let i = 0; i < res3.data.data.message.length; i++) {
                            res3.data.data.message[i].imageUrl = _imageURL + res3.data.data.message[i].emailDomain + "_" + res3.data.data.message[i].uid + ".png";

                        }
                        this.setState({
                            favoutiteEmails: res3.data.data.message,
                            allWebsite: res3.data.data.message,
                            totalItemsData: res3.data.data.message,
                            isLength: true,
                            totalItemsCount: res3.data.data.totalCount
                        });

                        // this.setState({
                        //     isLength: true
                        // });
                    }
                }).catch((error) => {
                    this.setState({
                        isLength: true
                    });
                    console.log("error :", error);
                });

                /** getting  all websites */
                getWebsitesListByUserId(value._id).then((res) => {
                    if (res.data.success == true) {
                        this.setState({
                            websiteList: res.data.data.websiteList
                        });
                    }
                }).catch((error) => {
                    console.log("error :", error);
                });

                /** getting all tags */
                getWebsiteTags(value._id).then((tags) => {
                    if (tags.data.success == true) {
                        this.setState({
                            Tags: tags.data.data
                        });
                    }
                }).catch((error) => {
                    console.log("error :", error);
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

    handleChange(event) {
        var change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
        if (event.target.name == "website_name") {
            if (event.target.value == "allWebsite") {


                // if (localStorage.getItem("date")) {
                //     let value = JSON.parse(localStorage.getItem("date"));
                //     const data = {
                //         user_id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
                //         fromDate: value.startDate,
                //         toDate: value.endDate,
                //         typeofmail: 'Flagged'
                //     };
                //     getFavouriteMailsByDateForAllWebsites(data).then((result8) => {
                //         console.log("result888 :", result8);
                //         if (result8.data.success == true) {
                //             this.setState({
                //                 favoutiteEmails: result8.data.data.message
                //             });
                //         }
                //     }).catch((error) => {
                //         console.log("errorr :", error);
                //     });
                // }

                if (localStorage.getItem("date")) {
                    setTimeout(() => {
                        let value = JSON.parse(localStorage.getItem("date"));
                        const data = {
                            user_id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
                            fromDate: value.startDate,
                            toDate: value.endDate,
                            typeofmail: 'Flagged'
                        };
                        getFavouriteMailsByDateForAllWebsites(data).then((result8) => {
                            //this.props.loaderShow(false);
                            console.log("result888 :", result8);
                            if (result8.data.success == true) {
                                // this.setState({
                                //     favoutiteEmails: result8.data.data.message
                                // });
                                // const that=this;
                                // (async function loop() {
                                //     for (let i = 0; i < result8.data.data.message.length; i++) {
                                //         await new Promise(resolve => {
                                //             simpleParser(result8.data.data.message[i].buffer, (err, parsed) => {
                                //                 if(parsed.html)
                                //                 result8.data.data.message[i].htmlData=parsed.html
                                //                 else
                                //                 result8.data.data.message[i].htmlData = result8.data.data.message[i].body;
                                //                  resolve(parsed);
                                //             });

                                //         });
                                //         console.log(i);

                                //     }
                                //     that.setState({
                                //         favoutiteEmails: result8.data.data.message
                                //     });
                                //     that.props.loaderShow(false);

                                // })();
                                for (let i = 0; i < result8.data.data.message.length; i++) {
                                    result8.data.data.message[i].imageUrl = _imageURL + result8.data.data.message[i].emailDomain + "_" + result8.data.data.message[i].uid + ".png";

                                }
                                this.setState({
                                    favoutiteEmails: result8.data.data.message
                                });
                            }
                            else {
                                NotificationManager.error('Please try again later.', "Error");
                            }
                        }).catch((error) => {
                            console.log("errorr :", error);
                            this.setState({
                                favoutiteEmails: []
                            });
                        });
                    }, 500);
                } else {
                    this.setState({
                        favoutiteEmails: this.state.allWebsite
                    });
                }
            } else {
                setTimeout(() => {
                    this.listOfFavouriteonWebsiteSelect()
                }, 100)

            }

        }
    }

    listOfFavouriteonWebsiteSelect() {
        if (this.state.websiteList.length != 0) {
            this.state.websiteList.map((result1) => {
                if (this.state.website_name == result1.website_name) {
                    const value = {
                        emailDomain: result1.emailDomain,
                        unique_id: result1.unique_id
                    };
                    localStorage.setItem("emailDomain&Id", JSON.stringify(value));
                    if (localStorage.getItem("date")) {
                        let value = JSON.parse(localStorage.getItem("date"));
                        const data = {
                            emailDomain: result1.emailDomain,
                            unique_id: result1.unique_id,
                            fromDate: value.startDate,
                            toDate: value.endDate,
                            typeofmail: 'Flagged'
                        };
                        getFavouriteMailsByDate(data).then((res4, index) => {
                            //this.props.loaderShow(false);
                            console.log("by date res :", res4);
                            if (res4.data.success == true) {
                                // this.setState({
                                //     favoutiteEmails: res4.data.data.message
                                // });
                                // const that=this;
                                // (async function loop() {
                                //     for (let i = 0; i < res4.data.data.message.length; i++) {
                                //         await new Promise(resolve => {
                                //             simpleParser(res4.data.data.message[i].buffer, (err, parsed) => {
                                //                 if(parsed.html)
                                //                 res4.data.data.message[i].htmlData=parsed.html
                                //                 else
                                //                 res4.data.data.message[i].htmlData = res4.data.data.message[i].body;
                                //                  resolve(parsed);
                                //             });

                                //         });
                                //         console.log(i);

                                //     }
                                //     that.setState({
                                //         favoutiteEmails: res4.data.data.message
                                //     });
                                //     that.props.loaderShow(false);

                                // })();
                                for (let i = 0; i < res4.data.data.message.length; i++) {
                                    res4.data.data.message[i].imageUrl = _imageURL + res4.data.data.message[i].emailDomain + "_" + res4.data.data.message[i].uid + ".png";

                                }
                                this.setState({
                                    favoutiteEmails: res4.data.data.message
                                });
                            } else {
                                this.setState({
                                    favoutiteEmails: []
                                });
                                NotificationManager.error(res4.data.data, "Error");
                            }
                        }).catch((error) => {
                            console.log("error :", error);
                            this.setState({
                                favoutiteEmails: []
                            });
                        });
                    } else {
                        const data = {
                            emailDomain: result1.emailDomain,
                            unique_id: result1.unique_id
                        };
                        getFavouriteOnPerticular(data).then((res4, index) => {
                            // this.props.loaderShow(false);
                            console.log("res4 :", res4);
                            if (res4.data.success == true) {
                                // this.setState({
                                //     favoutiteEmails: res4.data.data.message
                                // });
                                // const that=this;
                                // (async function loop() {
                                //     for (let i = 0; i < res4.data.data.message.length; i++) {
                                //         await new Promise(resolve => {
                                //             simpleParser(res4.data.data.message[i].buffer, (err, parsed) => {
                                //                 if(parsed.html)
                                //                 res4.data.data.message[i].htmlData=parsed.html
                                //                 else
                                //                 res4.data.data.message[i].htmlData = res4.data.data.message[i].body;
                                //                  resolve(parsed);
                                //             });

                                //         });
                                //         console.log(i);

                                //     }
                                //     that.setState({
                                //         favoutiteEmails: res4.data.data.message
                                //     });
                                //     that.props.loaderShow(false);

                                // })();
                                for (let i = 0; i < res4.data.data.message.length; i++) {
                                    res4.data.data.message[i].imageUrl = _imageURL + res4.data.data.message[i].emailDomain + "_" + res4.data.data.message[i].uid + ".png";

                                }
                                this.setState({
                                    favoutiteEmails: res4.data.data.message
                                });
                            } else {
                                this.setState({
                                    favoutiteEmails: []
                                });
                                NotificationManager.error(res4.data.data.message, "Error");
                            }
                        }).catch((error) => {
                            console.log("error :", error);
                            this.setState({
                                favoutiteEmails: []
                            });
                        });
                    }
                }
            });
        }
    }

    handleTagsChange(event) {
        var change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
        if (event.target.name == "tags") {
            if (event.target.value == "alltags") {
                if (localStorage.getItem("date")) {
                    setTimeout(() => {
                        let value = JSON.parse(localStorage.getItem("date"));
                        const data = {
                            user_id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
                            fromDate: value.startDate,
                            toDate: value.endDate,
                            typeofmail: 'Flagged'
                        };
                        getFavouriteMailsByDateForAllWebsites(data).then((result8) => {
                            //this.props.loaderShow(false);
                            console.log("result888 :", result8);
                            if (result8.data.success == true) {
                                // this.setState({
                                //     favoutiteEmails: result8.data.data.message
                                // });
                                // const that=this;
                                // (async function loop() {
                                //     for (let i = 0; i < result8.data.data.message.length; i++) {
                                //         await new Promise(resolve => {
                                //             simpleParser(result8.data.data.message[i].buffer, (err, parsed) => {
                                //                 if(parsed.html)
                                //                 result8.data.data.message[i].htmlData=parsed.html
                                //                 else
                                //                 result8.data.data.message[i].htmlData = result8.data.data.message[i].body;
                                //                  resolve(parsed);
                                //             });

                                //         });
                                //         console.log(i);

                                //     }
                                //     that.setState({
                                //         favoutiteEmails: result8.data.data.message
                                //     });
                                //     that.props.loaderShow(false);

                                // })();
                                for (let i = 0; i < result8.data.data.message.length; i++) {
                                    result8.data.data.message[i].imageUrl = _imageURL + result8.data.data.message[i].emailDomain + "_" + result8.data.data.message[i].uid + ".png";

                                }
                                this.setState({
                                    favoutiteEmails: result8.data.data.message
                                });
                            }
                            else {
                                this.props.loaderShow(false);
                                NotificationManager.error("Please try again later", "Error");
                            }
                        }).catch((error) => {
                            this.props.loaderShow(false);
                            console.log("errorr :", error);
                            this.setState({
                                favoutiteEmails: []
                            });
                        });
                    }, 500);
                } else {
                    this.setState({
                        favoutiteEmails: this.state.allWebsite
                    });
                }
            } else {
                setTimeout(() => {
                    this.listOfFavouriteOnTagSelect()
                }, 100)
            }
        }
    }

    listOfFavouriteOnTagSelect() {
        if (this.state.websiteList.length != 0) {
            this.state.websiteList.map((result1) => {
                if (result1.tags.length != 0) {
                    result1.tags.map((result7, i) => {
                        if (this.state.tags == result7.text) {
                            const data = {
                                emailDomain: result1.emailDomain,
                                unique_id: result1.unique_id
                            };
                            localStorage.setItem("emailDomain&Id", JSON.stringify(data));
                            if (localStorage.getItem("date")) {
                                let value = JSON.parse(localStorage.getItem("date"));
                                const data = {
                                    emailDomain: result1.emailDomain,
                                    unique_id: result1.unique_id,
                                    fromDate: value.startDate,
                                    toDate: value.endDate,
                                    typeofmail: 'Flagged'
                                };
                                this.props.loaderShow(true);
                                getFavouriteMailsByDate(data).then((res4, index) => {
                                    //this.props.loaderShow(false);
                                    console.log("by date res :", res4);
                                    if (res4.data.success == true) {
                                        // this.setState({
                                        //     favoutiteEmails: res4.data.data.message
                                        // });
                                        //         const that=this;
                                        // (async function loop() {
                                        //     for (let i = 0; i < res4.data.data.message.length; i++) {
                                        //         await new Promise(resolve => {
                                        //             simpleParser(res4.data.data.message[i].buffer, (err, parsed) => {
                                        //                 if(parsed.html)
                                        //                 res4.data.data.message[i].htmlData=parsed.html
                                        //                 else
                                        //                 res4.data.data.message[i].htmlData = res4.data.data.message[i].body;
                                        //                  resolve(parsed);
                                        //             });

                                        //         });
                                        //         console.log(i);

                                        //     }
                                        //     that.setState({
                                        //         favoutiteEmails: res4.data.data.message
                                        //     });
                                        //     that.props.loaderShow(false);

                                        // })();
                                        for (let i = 0; i < res4.data.data.message.length; i++) {
                                            res4.data.data.message[i].imageUrl = _imageURL + res4.data.data.message[i].emailDomain + "_" + res4.data.data.message[i].uid + ".png";

                                        }
                                        this.setState({
                                            favoutiteEmails: res4.data.data.message
                                        });
                                        this.props.loaderShow(false);
                                    } else {
                                        this.props.loaderShow(false);
                                        this.setState({
                                            favoutiteEmails: []
                                        });
                                        NotificationManager.error(res4.data.data, "Error");
                                    }
                                }).catch((error) => {
                                    this.props.loaderShow(false);
                                    console.log("error :", error);
                                    this.setState({
                                        favoutiteEmails: []
                                    });
                                });
                            } else {
                                const data = {
                                    emailDomain: result1.emailDomain,
                                    unique_id: result1.unique_id
                                };
                                this.props.loaderShow(true);
                                getFavouriteOnPerticular(data).then((res4, index) => {
                                    //this.props.loaderShow(false);
                                    if (res4.data.success == true) {
                                        // this.setState({
                                        //     favoutiteEmails: res4.data.data.message
                                        // });
                                        // const that=this;
                                        // (async function loop() {
                                        //     for (let i = 0; i < res4.data.data.message.length; i++) {
                                        //         await new Promise(resolve => {
                                        //             simpleParser(res4.data.data.message[i].buffer, (err, parsed) => {
                                        //                 if(parsed.html)
                                        //                 res4.data.data.message[i].htmlData=parsed.html
                                        //                 else
                                        //                 res4.data.data.message[i].htmlData = res4.data.data.message[i].body;
                                        //                  resolve(parsed);
                                        //             });

                                        //         });
                                        //         console.log(i);

                                        //     }
                                        //     that.setState({
                                        //         favoutiteEmails: res4.data.data.message
                                        //     });
                                        //     that.props.loaderShow(false);

                                        // })();
                                        for (let i = 0; i < res4.data.data.message.length; i++) {
                                            res4.data.data.message[i].imageUrl = _imageURL + res4.data.data.message[i].emailDomain + "_" + res4.data.data.message[i].uid + ".png";

                                        }
                                        this.setState({
                                            favoutiteEmails: res4.data.data.message
                                        });
                                        this.props.loaderShow(false);
                                    } else {
                                        this.props.loaderShow(false);
                                        this.setState({
                                            favoutiteEmails: []
                                        });
                                        NotificationManager.error(res4.data.data.message, "Error");
                                    }
                                }).catch((error) => {
                                    this.props.loaderShow(false);
                                    console.log("error :", error);
                                    this.setState({
                                        favoutiteEmails: []
                                    });
                                });
                            }
                        }
                    });
                }
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
                                    <h2><a href="javascript:void(0)" onClick={() => this.showMail(res.emailDomain, res.unique_id, res.uid)}>{res.header.subject[0]}</a></h2>
                                    <p><span>from: </span> <a href="javascript:void(0)" onClick={() => this.showMail(res.emailDomain, res.unique_id, res.uid)}>{(res.header.from[0]).split("<")[0]}</a></p>
                                    {/* <p><span>to: </span> <a href="javascript:void(0)">{res.header.to[0]}</a></p> */}
                                    {/* <p><span>Sent: </span> <a href="javascript:void(0)">{res.header.date[0]}</a></p> */}
                                    <p><span>Sent: </span> <a href="javascript:void(0)">{res.header.date[0].split(" ")[0] + " " + res.header.date[0].split(" ")[1] + " " + res.header.date[0].split(" ")[2] + " " + res.header.date[0].split(" ")[3]}</a></p>
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
                            <a href="javascript:void(0)" className="text-primary float-right" onClick={() => this.showMail(res.emailDomain, res.unique_id, res.uid)}> View Email </a>
                        </div>
                    </div>
                </div>
            ));

        } else if (this.state.isLength == false) {
            return <div className="p-4"><h3>Loading...</h3></div>
        }
        else {
            return (
                <div className="no-image">
                    <img src={require('../../../../assets/images/star-image.png')} className="img-fluid mb-3" />
                    <h2 className="mb-3">You've not starred any emails yet!</h2>

                    <p>You can star emails you like or want to take note of, and then you can view them here. Star emails by clicking the star to the right of the subject line.</p>
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
        let myFavEmails = this.state.favoutiteEmails;
        for (let i = 0; i < myFavEmails.length; i++) {
            if (myFavEmails[i].uid == value) {
                myFavEmails[i].flag = 1;
                break;
            }
        }
        this.setState({ favoutiteEmails: myFavEmails });
        this.props.loaderShow(true);
        markMailAsFavourite(data).then((res) => {
            this.props.loaderShow(false);
            if (res.data.success == true) {
                // getListOfFavouritesByUserId(JSON.parse(localStorage.getItem("catchLetterDetails"))._id).then((res3) => {
                //     console.log("getListOfFavouritesByUserId :", res3);
                //     if (res3) {
                //         this.setState({
                //             favoutiteEmails: res3.data.data.message,
                //             allWebsite: res3.data.data.message,
                //             totalItemsData: res3.data.data.message
                //         });
                //     }
                // }).catch((error) => {
                //     console.log("error :", error);
                // });
                //NotificationManager.success(res.data.data.message, "Success");
            }
        }).catch((error) => {
            this.props.loaderShow(false);
            console.log("error :", error);
        });
    }

    removeMailAsFavourite(emailDomain, unique_id, value, seqno) {
        const data = {
            emailDomain: emailDomain,
            unique_id: unique_id,
            id: JSON.stringify(value),
            seqno: JSON.stringify(value)
        };
        let myFavEmails = this.state.favoutiteEmails;
        for (let i = 0; i < myFavEmails.length; i++) {
            if (myFavEmails[i].uid == value) {
                myFavEmails[i].flag = 0;
                break;
            }
        }
        this.setState({ favoutiteEmails: myFavEmails });
        this.props.loaderShow(true);
        removeMailAsFavouriteId(data).then((res) => {
            this.props.loaderShow(false);
            if (res.data.success == true) {
                // getListOfFavouritesByUserId(JSON.parse(localStorage.getItem("catchLetterDetails"))._id).then((res3) => {
                //     console.log("getListOfFavouritesByUserId :", res3);
                //     if (res3) {
                //         this.setState({
                //             favoutiteEmails: res3.data.data.message
                //         });
                //     }
                // }).catch((error) => {
                //     console.log("error :", error);
                // });
                // NotificationManager.success(res.data.data.message, "Success");
            }
        }).catch((error) => {
            this.props.loaderShow(false);
            console.log("error :", error);
        });
    }

    showMail(emailDomain, unique_id, value) {
        const data = {
            emailDomain: emailDomain,
            unique_id: unique_id,
            id: JSON.stringify(value),
            user_id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id
        };
        this.props.onHistory.push({ pathname: "/emailDetail", value: data });
    }

    searchMails() {
        let value = this.state.inputText;
        let items;
        if (this.state.totalItemsData.length != 0) {
            if (value) {
                const regex = new RegExp(`${value.trim()}`, 'i');

                let newItems = [];
                for (let i = 0; i < this.state.totalItemsData.length; i++) {
                    if (this.state.totalItemsData[i].header && this.state.totalItemsData[i].header.subject && this.state.totalItemsData[i].header.subject.length && this.state.totalItemsData[i].header.subject.length > 0) {
                        if (this.state.totalItemsData[i].header.subject[0].toLowerCase().includes(value.toLowerCase())) {
                            newItems.push(this.state.totalItemsData[i]);
                        }
                    }
                }
                this.setState({
                    favoutiteEmails: newItems
                });
            } else {
                const totalItems = this.state.totalItemsData;
                this.setState({
                    favoutiteEmails: totalItems
                });
            }
        }
    }

    handleSelect(range) {
        let newStartMonth;
        let newEndMonth;

        if (range.startDate != range.endDate) {
            this.setState({
                sDate: range.startDate,
                eDate: range.endDate
            });
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
        console.log(" startDate :", startDate);

        let endDate = endDateDay + "/" + newEndMonth + "/" + endDateYear;
        console.log(" endDate :", endDate);


        if (startDate != endDate) {
            this.setState({
                IsShowDatePicker: false,
                date: startDate + "-" + endDate
            });
            if (startDate && endDate) {
                const data = {
                    startDate: startDate,
                    endDate: endDate
                };
                localStorage.setItem("date", JSON.stringify(data));
            }

            if (localStorage.getItem("emailDomain&Id") && localStorage.getItem("date")) {
                let value = JSON.parse(localStorage.getItem("emailDomain&Id"));
                let valueOne = JSON.parse(localStorage.getItem("date"));
                const data = {
                    emailDomain: value.emailDomain,
                    unique_id: value.unique_id,
                    fromDate: valueOne.startDate,
                    toDate: valueOne.endDate,
                    typeofmail: 'Flagged'
                };
                this.props.loaderShow(true);
                getFavouriteMailsByDate(data).then((res4, index) => {
                    //this.props.loaderShow(false);
                    console.log("by date res :", res4);
                    if (res4.data.success == true) {
                        // this.setState({
                        //     favoutiteEmails: res4.data.data.message
                        // });
                        // const that = this;
                        // (async function loop() {
                        //     for (let i = 0; i < res4.data.data.message.length; i++) {
                        //         await new Promise(resolve => {
                        //             simpleParser(res4.data.data.message[i].buffer, (err, parsed) => {
                        //                 if (parsed.html)
                        //                     res4.data.data.message[i].htmlData = parsed.html
                        //                 else
                        //                     res4.data.data.message[i].htmlData = res4.data.data.message[i].body;
                        //                 resolve(parsed);
                        //             });

                        //         });
                        //         console.log(i);

                        //     }
                        //     that.setState({
                        //         favoutiteEmails: res4.data.data.message
                        //     });
                        //     that.props.loaderShow(false);

                        // })();

                        for (let i = 0; i < res4.data.data.message.length; i++) {
                            res4.data.data.message[i].imageUrl = _imageURL + res4.data.data.message[i].emailDomain + "_" + res4.data.data.message[i].uid + ".png";

                        }
                        this.setState({
                            favoutiteEmails: res4.data.data.message
                        });
                        this.props.loaderShow(false);
                    } else {
                        this.props.loaderShow(false);
                        this.setState({
                            favoutiteEmails: []
                        });
                        NotificationManager.error(res4.data.data, "Error");
                    }
                }).catch((error) => {
                    this.props.loaderShow(false);
                    console.log("error :", error);
                    this.setState({
                        favoutiteEmails: []
                    });
                });
            }

            if (localStorage.getItem("date")) {
                setTimeout(() => {
                    let value = JSON.parse(localStorage.getItem("date"));
                    const data = {
                        user_id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
                        fromDate: value.startDate,
                        toDate: value.endDate,
                        typeofmail: 'Flagged'
                    };
                    this.props.loaderShow(true);
                    getFavouriteMailsByDateForAllWebsites(data).then((result8) => {
                        console.log("result888 :", result8);
                        if (result8.data.success == true) {
                            // this.setState({
                            //     favoutiteEmails: result8.data.data.message
                            // });
                            // const that = this;
                            // (async function loop() {
                            //     for (let i = 0; i < result8.data.data.message.length; i++) {
                            //         await new Promise(resolve => {
                            //             simpleParser(result8.data.data.message[i].buffer, (err, parsed) => {
                            //                 if (parsed.html)
                            //                     result8.data.data.message[i].htmlData = parsed.html
                            //                 else
                            //                     result8.data.data.message[i].htmlData = result8.data.data.message[i].body;
                            //                 resolve(parsed);
                            //             });

                            //         });
                            //         console.log(i);

                            //     }
                            //     that.setState({
                            //         favoutiteEmails: result8.data.data.message
                            //     });
                            //     that.props.loaderShow(false);

                            // })();

                            for (let i = 0; i < result8.data.data.message.length; i++) {
                                result8.data.data.message[i].imageUrl = _imageURL + result8.data.data.message[i].emailDomain + "_" + result8.data.data.message[i].uid + ".png";
                            }

                            this.setState({
                                favoutiteEmails: result8.data.data.message
                            });
                            this.props.loaderShow(false);
                        }
                        else {
                            this.props.loaderShow(false);
                            this.setState({
                                favoutiteEmails: []
                            });
                        }
                    }).catch((error) => {
                        this.props.loaderShow(false);
                        console.log("errorr :", error);
                        this.setState({
                            favoutiteEmails: []
                        });
                    });
                }, 500);
            }
        }
    }

    handlePageChange(pageNumber) {
        this.setState({ pageNumber: pageNumber });
        getListOfFavouritesByUserId(JSON.parse(localStorage.getItem("catchLetterDetails"))._id, pageNumber).then((res) => {
            if (res.data.success == true) {
                for (let i = 0; i < res.data.data.message.length; i++) {
                    res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                }
                this.setState({
                    favoutiteEmails: res.data.data.message
                });
                this.props.loaderShow(false);
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


    render() {
        return (
            <section className="top-star-row py-5">
                <div className="container">
                    <div className="top-h mb-4">
                        <h1>Favourite emails</h1>
                    </div>
                    <div className="filter-bar py-2 mb-4">
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="f-bx">
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
                                    {/* <select className="form-control">
                                        <option>All Websites Tags</option>
                                        <option>5 Websites Tags</option>
                                    </select> */}
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
                    <div className="mail-cards">
                        <div className="row">
                            {this.renderFavouriteEmails()}

                            {/* <div className="col-12 col-md-6 col-lg-3">
                                <div className="card shadow">
                                    <div className="card-header">
                                        <h2><a href="email-details.html">Welcome to Myntra. A special coupon has been added to your account.</a></h2>
                                        <p><span>from: </span> <a href>Catch letter</a></p>
                                        <p><span>Sent: </span> Thursday 12 July 2018 at 15:30</p>
                                        <a href="" className="star-ml"><i className="fa fa-star" /></a>
                                    </div>
                                    <div className="card-body">
                                        <figure>
                                            <img src="images/email.jpg" className="img-fluid" alt="emailer" />
                                        </figure>
                                    </div>
                                    <div className="card-footer clearfix">
                                        <span className="float-left left">
                                            <input type="checkbox" className="checkbox-custom" title="click to select" />
                                        </span>
                                        <a href className="text-primary float-right"> View Email </a>
                                    </div>
                                </div>
                            </div> */}

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
        )
    }
}

export default FavouriteEmails;