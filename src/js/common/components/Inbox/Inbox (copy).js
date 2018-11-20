import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import _imageURL from '../../_imageURL';

import {
    getListOfMailsByUserId,
    getWebsitesListByUserId,
    removeMailAsFavouriteId,
    markMailAsFavourite,
    getWebsiteTags,
    getFavouriteMailsByDate,
    getFavouriteMailsByDateForAllWebsites,
    getListOfMailsByWebsite,
    getListOfMailsByUserIdWithPagination
} from '../../../api/commonApi';
import EmailDetails from '../EmailDetails/EmailDetails';
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
            selectedUniqueId: ''
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

    handleDateOne() {
        this.setState({
            IsShowDatePicker: false
        });
    }

    componentDidMount() {

        window.scrollTo(0, 0);
        localStorage.removeItem("emailDomain&Id");
        localStorage.removeItem("date");

        if (localStorage.getItem("catchLetterDetails")) {
            let value = JSON.parse(localStorage.getItem("catchLetterDetails"));
            this.props.loaderShow(true);
            if (value) {
                /** getting all emails */

                const data = {
                    id: value._id,
                    page: this.state.pageNumber
                };
                getListOfMailsByUserIdWithPagination(data).then((res) => {
                    if (res.data.success == true) {
                        console.log("resssssss :", res);
                        // this.props.loaderShow(false);
                        // this.setState({
                        //     favoutiteEmails: res.data.data.message,
                        //     totalItemsData: res.data.data.message,
                        //     allWebsite: res.data.data.message,
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
                        //         favoutiteEmails: res.data.data.message,
                        //             totalItemsData: res.data.data.message,
                        //             allWebsite: res.data.data.message,
                        //     });
                        //     that.props.loaderShow(false);
                        // })();

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
                        this.props.loaderShow(false);
                        this.setState({
                            isLength: true
                        });
                    }
                    else {
                        NotificationManager.error(res.data.data.message, "Error");
                    }
                }).catch((err) => {
                    this.setState({
                        isLength: true
                    });
                    this.props.loaderShow(false);
                    NotificationManager.error(err.response.data.data, "Error");
                })
                /** getting  all websites */
                getWebsitesListByUserId(value._id).then((res) => {
                    this.props.loaderShow(false);
                    console.log("getWebsitesListByUserId :", res);
                    if (res.data.success == true) {
                        this.setState({
                            websiteList: res.data.data.websiteList
                        });
                    }
                }).catch((error) => {
                    this.props.loaderShow(false);
                    console.log("error :", error);
                });

                /** getting all tags */
                getWebsiteTags(value._id).then((tags) => {
                    this.props.loaderShow(false);
                    if (tags.data.success == true) {
                        this.setState({
                            Tags: tags.data.data
                        });
                    }
                }).catch((error) => {
                    this.props.loaderShow(false);
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
                //     let value = JSON.parse(localStorage.getItem("date"));JSON.parse(localStorage.getItem("catchLetterDetails"))
                //     const data = {
                //         user_id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
                //         fromDate: value.startDate,
                //         toDate: value.endDate,
                //         typeofmail: 'All'
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
                this.props.loaderShow(true);
                if (localStorage.getItem("date")) {
                    setTimeout(() => {
                        let value = JSON.parse(localStorage.getItem("date"));
                        const data = {
                            user_id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
                            fromDate: value.startDate,
                            toDate: value.endDate,
                            typeofmail: 'All'
                        };
                        getFavouriteMailsByDateForAllWebsites(data).then((result8) => {
                            this.props.loaderShow(false);
                            console.log("result888 :", result8);
                            if (result8.data.success == true) {
                                const that = this;
                                // this.setState({
                                //     favoutiteEmails: result8.data.data.message
                                // });
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

                                // })();
                                for (let i = 0; i < result8.data.data.message.length; i++) {
                                    result8.data.data.message[i].imageUrl = _imageURL + result8.data.data.message[i].emailDomain + "_" + result8.data.data.message[i].uid + ".png";
                                }
                                this.setState({
                                    favoutiteEmails: result8.data.data.message
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
                } else {
                    // this.props.loaderShow(false);
                    // this.setState({
                    //     favoutiteEmails: this.state.allWebsite,
                    //     totalItemsCount: this.state.initialTotalItemCount
                    // });


                    const data = {
                        id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
                        emailDomain: JSON.parse(localStorage.getItem("catchLetterDetails")) ? JSON.parse(localStorage.getItem("catchLetterDetails")).emailDomain : '',
                        unique_id: JSON.parse(localStorage.getItem("catchLetterDetails")) ? JSON.parse(localStorage.getItem("catchLetterDetails")).unique_id : '',
                        tags: this.state.tags ? this.state.tags : '',
                        subject: this.state.inputText ? this.state.inputText.trim() : ''
                    };
                    getListOfMailsByUserIdWithPagination(data).then((res) => {
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
                        this.props.loaderShow(true);
                        let value = JSON.parse(localStorage.getItem("date"));
                        const data = {
                            emailDomain: result1.emailDomain,
                            unique_id: result1.unique_id,
                            fromDate: value.startDate,
                            toDate: value.endDate,
                            typeofmail: 'All'
                        };
                        getFavouriteMailsByDate(data).then((res4, index) => {
                            // this.props.loaderShow(false);
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
                                })
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
                            id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
                            emailDomain: result1.emailDomain,
                            unique_id: result1.unique_id,
                            // emailDomain: JSON.parse(localStorage.getItem("catchLetterDetails")) ? JSON.parse(localStorage.getItem("catchLetterDetails")).emailDomain : '',
                            // unique_id: JSON.parse(localStorage.getItem("catchLetterDetails")) ? JSON.parse(localStorage.getItem("catchLetterDetails")).unique_id : '',
                            tags: this.state.tags ? this.state.tags : '',
                            subject: this.state.inputText ? this.state.inputText.trim() : ''
                        };

                        getListOfMailsByUserIdWithPagination(data).then((res) => {
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
                                    favoutiteEmails: []
                                });
                            }
                        }).catch((error) => {
                            console.log(error);
                            this.setState({
                                favoutiteEmails: []
                            });
                        });

                        // this.props.loaderShow(true);

                        // getListOfMailsByWebsite(data).then((res4, index) => {
                        //     console.log("res4 :", res4);
                        //     if (res4.data.success == true) {
                        //         for (let i = 0; i < res4.data.data.message.length; i++) {
                        //             res4.data.data.message[i].imageUrl = _imageURL + res4.data.data.message[i].emailDomain + "_" + res4.data.data.message[i].uid + ".png";
                        //         }
                        //         this.setState({
                        //             favoutiteEmails: res4.data.data.message
                        //         });
                        //         this.props.loaderShow(false);
                        //     } else {
                        //         this.props.loaderShow(false);
                        //         this.setState({
                        //             favoutiteEmails: []
                        //         });
                        //         NotificationManager.error(res4.data.data.message, "Error");
                        //     }
                        // }).catch((error) => {
                        //     this.props.loaderShow(false);
                        //     console.log("error :", error);
                        //     this.setState({
                        //         favoutiteEmails: []
                        //     });
                        // });
                    }
                }
            });
        }
    }

    handlePageChange(pageNumber) {
        this.setState({ pageNumber: pageNumber });
        const data = {
            id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
            page: pageNumber,
            emailDomain: JSON.parse(localStorage.getItem("catchLetterDetails")) ? JSON.parse(localStorage.getItem("catchLetterDetails")).emailDomain : '',
            unique_id: JSON.parse(localStorage.getItem("catchLetterDetails")) ? JSON.parse(localStorage.getItem("catchLetterDetails")).unique_id : '',
            tags: this.state.tags ? this.state.tags : '',
            subject: this.state.inputText ? this.state.inputText.trim() : ''
        };
        getListOfMailsByUserIdWithPagination(data).then((res) => {
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
                            typeofmail: 'All'
                        };
                        this.props.loaderShow(true);
                        getFavouriteMailsByDateForAllWebsites(data).then((result8) => {
                            this.props.loaderShow(false);
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

                                // })();
                                for (let i = 0; i < result8.data.data.message.length; i++) {
                                    result8.data.data.message[i].imageUrl = _imageURL + result8.data.data.message[i].emailDomain + "_" + result8.data.data.message[i].uid + ".png";


                                }
                                this.setState({
                                    favoutiteEmails: result8.data.data.message
                                });
                                this.props.loaderShow(false);
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
                    // this.setState({
                    //     favoutiteEmails: this.state.allWebsite,
                    //     totalItemsCount: this.state.initialTotalItemCount
                    // });

                    const data = {
                        id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
                        emailDomain: JSON.parse(localStorage.getItem("catchLetterDetails")) ? JSON.parse(localStorage.getItem("catchLetterDetails")).emailDomain : '',
                        unique_id: JSON.parse(localStorage.getItem("catchLetterDetails")) ? JSON.parse(localStorage.getItem("catchLetterDetails")).unique_id : '',
                        tags: this.state.tags ? this.state.tags : '',
                        subject: this.state.inputText ? this.state.inputText.trim() : ''
                    };
                    getListOfMailsByUserIdWithPagination(data).then((res) => {
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
                                    typeofmail: 'All'
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
                            } else {
                                // const data = {
                                //     emailDomain: result1.emailDomain,
                                //     unique_id: result1.unique_id
                                // };
                                // this.props.loaderShow(true);
                                // getListOfMailsByWebsite(data).then((res4, index) => {
                                //     this.props.loaderShow(false);
                                //     if (res4.data.success == true) {
                                //         this.setState({
                                //             favoutiteEmails: res4.data.data.message
                                //         });
                                //     } else {
                                //         this.setState({
                                //             favoutiteEmails: []
                                //         });
                                //         NotificationManager.error(res4.data.data.message, "Error");
                                //     }
                                // }).catch((error) => {
                                //     this.props.loaderShow(false);
                                //     console.log("error :", error);
                                //     this.setState({
                                //         favoutiteEmails: []
                                //     });
                                // });

                                const data = {
                                    id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
                                    tags: this.state.tags ? this.state.tags : '',
                                    emailDomain: JSON.parse(localStorage.getItem("catchLetterDetails")) ? JSON.parse(localStorage.getItem("catchLetterDetails")).emailDomain : '',
                                    unique_id: JSON.parse(localStorage.getItem("catchLetterDetails")) ? JSON.parse(localStorage.getItem("catchLetterDetails")).unique_id : '',
                                    subject: this.state.inputText ? this.state.inputText.trim() : ''
                                };

                                getListOfMailsByUserIdWithPagination(data).then((res) => {
                                    console.log("res in tags :", res);
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
                                            favoutiteEmails: []
                                        });
                                    }
                                }).catch((error) => {
                                    console.log(error);
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
        this.props.loaderShow(true);
        let toChangeEmailArray = this.state.favoutiteEmails;
        toChangeEmailArray.map((item) => {
            if (item.uid == value) {
                item.flag = 1;
            }
        });
        this.setState({ favoutiteEmails: toChangeEmailArray });

        markMailAsFavourite(data).then((res) => {
            this.props.loaderShow(false);
            if (res.data.success == true) {
                getListOfMailsByUserId(JSON.parse(localStorage.getItem("catchLetterDetails"))._id).then((res) => {
                    if (res.data.success == true) {
                        // this.setState({
                        //     favoutiteEmails: res.data.data.message
                        // })
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
                        //         favoutiteEmails: res.data.data.message
                        //     });
                        // })();
                        for (let i = 0; i < res.data.data.message.length; i++) {
                            res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";


                            console.log(i);

                        }
                        this.setState({
                            favoutiteEmails: res.data.data.message
                        });
                        this.props.loaderShow(false);


                    }
                    else {
                        NotificationManager.error(res.data.data.message, "Error");
                    }
                }).catch((err) => {
                    NotificationManager.error(err.response.data.data, "Error");
                });
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
        this.props.loaderShow(true);
        let toChangeEmailArray = this.state.favoutiteEmails;
        toChangeEmailArray.map((item) => {
            if (item.uid == value) {
                item.flag = 0;
            }
        });
        this.setState({ favoutiteEmails: toChangeEmailArray });
        removeMailAsFavouriteId(data).then((res) => {
            this.props.loaderShow(false);
            if (res.data.success == true) {
                getListOfMailsByUserId(JSON.parse(localStorage.getItem("catchLetterDetails"))._id).then((res) => {
                    if (res.data.success == true) {
                        // this.setState({
                        //     favoutiteEmails: res.data.data.message
                        // })

                        const that = this;
                        (async function loop() {
                            for (let i = 0; i < res.data.data.message.length; i++) {
                                await new Promise(resolve => {
                                    simpleParser(res.data.data.message[i].buffer, (err, parsed) => {
                                        if (parsed.html)
                                            res.data.data.message[i].htmlData = parsed.html
                                        else
                                            res.data.data.message[i].htmlData = res.data.data.message[i].body;
                                        resolve(parsed);
                                    });

                                });
                                console.log(i);

                            }
                            that.setState({
                                favoutiteEmails: res.data.data.message
                            });
                        })();
                    }
                    else {
                        NotificationManager.error(res.data.data.message, "Error");
                    }
                }).catch((err) => {
                    NotificationManager.error(err.response.data.data, "Error");
                })
                //NotificationManager.success(res.data.data.message, "Success");
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
        // let value = this.state.inputText;
        // let items;
        // if (this.state.totalItemsData.length != 0) {
        //     if (value) {
        //         const regex = new RegExp(`${value.trim()}`, 'i');

        //         let newItems = [];
        //         for (let i = 0; i < this.state.totalItemsData.length; i++) {
        //             if (this.state.totalItemsData[i].header && this.state.totalItemsData[i].header.subject && this.state.totalItemsData[i].header.subject.length && this.state.totalItemsData[i].header.subject.length > 0) {
        //                 if (this.state.totalItemsData[i].header.subject[0].toLowerCase().includes(value.toLowerCase())) {
        //                     newItems.push(this.state.totalItemsData[i]);
        //                 }
        //             }
        //         }
        //         this.setState({
        //             favoutiteEmails: newItems
        //         });
        //     } else {
        //         const totalItems = this.state.totalItemsData;
        //         this.setState({
        //             favoutiteEmails: totalItems
        //         });
        //     }
        // }
        this.props.loaderShow(true);
        let value = this.state.inputText.trim();
        let requestBody = {};
        if (this.state.website_name) {
            if (localStorage.getItem("emailDomain&Id")) {
                requestBody.emailDomain = JSON.parse(localStorage.getItem("emailDomain&Id")).emailDomain;
                requestBody.unique_id = JSON.parse(localStorage.getItem("emailDomain&Id")).unique_id
            }

        }
        if (this.state.tags) {
            requestBody.tags = this.state.tags
        }
        requestBody.id = JSON.parse(localStorage.getItem("catchLetterDetails"))._id;


        if (value == "") {
            getListOfMailsByUserIdWithPagination(requestBody).then((res) => {
                if (res.data.success == true) {
                    for (let i = 0; i < res.data.data.message.length; i++) {
                        res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                    }
                    this.props.loaderShow(false);
                    this.setState({
                        favoutiteEmails: res.data.data.message,
                        totalItemsCount: res.data.data.totalCount
                    });
                } else {
                    this.props.loaderShow(false);
                    this.setState({
                        favoutiteEmails: []
                    });
                }
            }).catch((error) => {
                console.log(error);
                this.props.loaderShow(false);
                this.setState({
                    favoutiteEmails: []
                });
            });
        } else {
            requestBody.subject = value;
            getListOfMailsByUserIdWithPagination(requestBody).then((res) => {
                if (res.data.success == true) {
                    for (let i = 0; i < res.data.data.message.length; i++) {
                        res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                    }
                    this.props.loaderShow(false);
                    this.setState({
                        favoutiteEmails: res.data.data.message,
                        totalItemsCount: res.data.data.totalCount
                    });
                } else {
                    this.props.loaderShow(false);
                    this.setState({
                        favoutiteEmails: []
                    });
                }
            }).catch((error) => {
                console.log(error);
                this.props.loaderShow(false);
                this.setState({
                    favoutiteEmails: []
                });
            });
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
                    typeofmail: 'All'
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
                        typeofmail: 'All'
                    };
                    this.props.loaderShow(true);
                    getFavouriteMailsByDateForAllWebsites(data).then((result8) => {
                        this.props.loaderShow(false);
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

                            // })();

                            for (let i = 0; i < result8.data.data.message.length; i++) {
                                result8.data.data.message[i].imageUrl = _imageURL + result8.data.data.message[i].emailDomain + "_" + result8.data.data.message[i].uid + ".png";
                            }

                            this.setState({
                                favoutiteEmails: result8.data.data.message
                            });
                            this.props.loaderShow(false);
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

    renderItem(index, key) {
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

    listView() {
        this.setState({
            displayType: '',
            listViewButton: 'btn active',
            gridViewButton: 'btn'
        });
    }

    gridView() {
        this.setState({
            displayType: 'row',
            listViewButton: 'btn',
            gridViewButton: 'btn active'
        });
    }


    render() {
        return (
            <section className="top-star-row py-5">
                <div className="container">
                    <div className="top-h mb-4">
                        <h1>Inbox</h1>
                        <div id="btnContainer">
                            <button class={this.state.listViewButton} onClick={() => this.listView()}><i class="fa fa-bars"></i> List</button>
                            <button class={this.state.gridViewButton} onClick={() => this.gridView()}><i class="fa fa-th-large"></i> Grid</button>
                        </div>
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
                        <div className={this.state.displayType}>
                            {/* <ReactList
                                itemRenderer={this.renderItem.bind(this)}
                                length={this.state.favoutiteEmails.length}
                                type='simple'
                            /> */}

                            {this.renderFavouriteEmails()}
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
        )
    }
}

export default Inbox;