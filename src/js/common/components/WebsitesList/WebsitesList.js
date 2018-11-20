import React, { Component } from 'react';
import {
    getAllWebsitesByUserIdWithPagination,
    deleteWebsiteById,
    getWebsiteTags,
    findTagsOnInput,
    getBillingData,
    getwebsitebydatecheck,
    exportWebsite
} from '../../../api/commonApi';
import { NotificationManager } from 'react-notifications';

import CreateWebsite from '../Websites/Websites';
import Pagination from "react-js-pagination";
import { CopyToClipboard } from 'react-copy-to-clipboard';

import MailsByWebsite from '../MailsByWebsite/MailsByWebsite';
import Login from '../Login/Login';
import Billing from '../Billing/Billing';
import _zipUrl from '../../_zipUrl';
let IsLoggedIn = false;
let hiddenClipBoard = [];

class WebsitesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
            Tags: [],
            tagName: 'All website tags',
            dispalyWebsiteCount: '0',
            lastInsertedWebsite: [],
            isNotShowing: true,
            isLength: false,
            copied: false,
            expireMessage: '',
            pageNumber: 1,
            tags: '',
            totalData: [],
            totalItemsData: [],
            totalItems: '',
            totalItemsCount: 0,
            pageSizeOne: [{ val: 10 }, { val: 20 }, { val: 30 }, { val: 40 }, { val: 50 }],
            pageSize: 10
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

        if (this.props.onHistory.location.value === "websiteInserted") {
            this.setState({
                isNotShowing: false
            });
        }
        if (localStorage.getItem("catchLetterDetails")) {
            const userData = JSON.parse(localStorage.getItem("catchLetterDetails"));

            let userId = userData._id;

            const valueOne = {
                current_date: new Date(),
                userId: userId
            };

            getwebsitebydatecheck(valueOne).then((res) => {
                if (res.data.success == true) {
                    const message = res.data.data.message;
                    if (message == "You are within billing date.") {
                        setTimeout(() => {

                            if (userId) {
                                /** getting websites list */

                                const data = {
                                    id: userId,
                                    page: this.state.pageNumber,
                                    size: this.state.pageSize
                                };

                                getAllWebsitesByUserIdWithPagination(data).then((res) => {

                                    if (res.data.success == true) {

                                        this.setState({
                                            totalData: res.data.data.message,
                                            totalItemsData: res.data.data.message,
                                            dispalyWebsiteCount: res.data.data.totalCount,
                                            totalItems: res.data.data.totalCount,
                                            lastInsertedWebsite: res.data.data.message[0],
                                            totalItemsCount: res.data.data.totalCount
                                        });
                                        this.setState({
                                            isLength: true
                                        });

                                        if (this.state.totalData.length != 0) {
                                            for (let k = 0; k < this.state.totalData.length; k++) {
                                                hiddenClipBoard[k] = true;
                                            }
                                        }

                                        if (this.state.dispalyWebsiteCount.length != 0) {
                                            localStorage.setItem("websiteAdded", this.state.dispalyWebsiteCount);
                                        }
                                    }
                                }).catch((err) => {
                                    this.setState({
                                        isLength: true
                                    });

                                });

                                /** getting websites tags */
                                getWebsiteTags(userId).then((res) => {

                                    if (res.data.success == true) {
                                        this.setState({
                                            Tags: res.data.data
                                        });
                                    }
                                }).catch((error) => {
                                    console.log("err");
                                });
                            }
                        }, 200)

                    } else if (message == "Billing date is expired.") {
                        this.props.onHistory.push({ pathname: '/billingExpire' });
                    }
                }
            }).catch((error) => {

            });
        }
        if (!localStorage.getItem("catchLetterDetails")) {
            this.props.onHistory.push({ pathname: '/' });
            NotificationManager.error("Please login first.", "Error");
        }
    }

    /** save value to state */
    handleChange(event) {
        var change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
    }

    /** handle page change */
    handlePageNumberChange(event) {
        var change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
        if (change.pageSize != 0) {

            if (localStorage.getItem("catchLetterDetails")) {
                const userData = JSON.parse(localStorage.getItem("catchLetterDetails"));

                let requestBody = {};
                requestBody.id = userData._id;
                requestBody.size = change.pageSize;

                if (this.state.inputText) {
                    requestBody.subject = this.state.inputText;
                }
                if (this.state.tags && this.state.tags != "alltags") {
                    requestBody.tags = this.state.tags;
                }


                this.setState({
                    isLength: false
                });

                getAllWebsitesByUserIdWithPagination(requestBody).then((res) => {

                    this.setState({
                        isLength: true
                    });
                    if (res.data.success == true) {
                        if (res.data.success == true) {
                            this.setState({
                                totalData: res.data.data.message
                            });
                        }
                    }
                }).catch((error) => {

                    this.setState({
                        isLength: true,
                        totalData: []
                    })
                    NotificationManager.error("Please try again later.", "Error");
                });
            }
        }
    }

    /** display tags */
    // displayTags() {
    //     if (this.state.Tags.length != 0) {
    //         return this.state.Tags.map((res, index) => (
    //             <li key={index}><a href="javascript:void(0)" onClick={() => this.findTagsOnInput(res.text)}>{res.text}</a></li>
    //         ));
    //     }
    // }

    /** find tags on input */
    // findTagsOnInput(value) {
    //     if (value) {
    //         this.setState({
    //             tags: value,
    //             tagName: value
    //         });
    //         let requestBody = {};
    //         this.props.loaderShow(true);

    //         this.setState({
    //             isLength: false
    //         });

    //         let userData = JSON.parse(localStorage.getItem("catchLetterDetails"));

    //         requestBody.id = userData._id;
    //         if (this.state.inputText) {
    //             requestBody.subject = this.state.inputText;
    //         }
    //         requestBody.tags = value;

    //         getAllWebsitesByUserIdWithPagination(requestBody).then((res) => {
    //             this.props.loaderShow(false);
    //             this.setState({
    //                 isLength: true
    //             });
    //             if (res.data.success == true) {
    //                 if (res.data.success == true) {
    //                     this.setState({
    //                         totalData: res.data.data.message
    //                     });
    //                 }
    //             }
    //         }).catch((error) => {
    //             this.props.loaderShow(false);
    //             this.setState({
    //                 isLength: true,
    //                 totalData: []
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
            requestBody.size = this.state.pageSize;
            if (this.state.inputText) {
                requestBody.subject = this.state.inputText;
            }
            if (event.target.value == "alltags") {

            } else {
                requestBody.tags = event.target.value;
            }

            getAllWebsitesByUserIdWithPagination(requestBody).then((res) => {

                this.setState({
                    isLength: true
                });
                if (res.data.success == true) {
                    if (res.data.success == true) {
                        this.setState({
                            totalData: res.data.data.message
                        });
                    }
                }
            }).catch((error) => {

                this.setState({
                    isLength: true,
                    totalData: []
                })
                NotificationManager.error("Please try again later.", "Error");
            });
        }
    }

    copyToClipBoard(index) {
        this.setState({ copied: true });
        hiddenClipBoard.map((res, i) => {
            if (index == i) {
                NotificationManager.success("Email is copied.", "Success");
            }
        });
    }
    export(res) {
        console.log(res);
        debugger;
        exportWebsite({ websiteId: res._id }).then((respon) => {
            console.log(respon);
            debugger;
            if (respon.data.success == true) {
                let zipUrlToDownload = respon.data.data.zipUrl;
                window.location.href = _zipUrl + zipUrlToDownload;
            }
        }).catch((err) => {
            debugger;
            NotificationManager.info(err.response.data.data, "Info");
        })

    }

    /** display websites */
    displayWebsite() {
        if (this.state.totalData.length != 0) {
            return this.state.totalData.map((res, index) => (

                <div className="custom-h" key={index} style={{ "position": "relative", "padding-bottom": "50px" }}>
                    <a className="w-100 d-md-flex" href="javascript:void(0)" onClick={() => this.goMailsByWebsite(res)} style={{ "text-decoration": "none", "color": "#000" }}>
                        {/* <div c classNamelassName="w-100 d-md-flex custom-h" key={index}> */}
                        <div className="col-md-6 d-md-flex align-items-center">
                            <div className="media ">
                                {/* <img className="mr-3 img-fluid pic" src={require('../../../../assets/images/1.png')} alt="Generic placeholder image" /> */}
                                <div className="media-body" >
                                    <h5 className="mt-0" onClick={() => this.goMailsByWebsite(res)}>{res.website_name} </h5>
                                    <p onClick={() => this.goMailsByWebsite(res)}>{res.homepage_url}</p>
                                    <span>{res.emailDomain}</span>

                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 d-md-flex align-items-center justify-content-end" key={index}>
                            {
                                res.tags && res.tags.length != 0 ? res.tags.map((item, index) => {
                                    return (
                                        <button key={index} type="button" className="badge badge-primary">{item.text}</button>
                                    )

                                })
                                    : (
                                        <button type="button" className="badge badge-secondary">No tags found.</button>
                                    )
                            }
                        </div>
                    </a>
                    <div className="abs-btn d-flex justify-content-end">
                        <div className="copy-box" style={{ "position": "absolute", "z-index": "9", "left": "15px", "bottom": "10px" }}>
                            <CopyToClipboard text={res.emailDomain}
                                onCopy={() => this.copyToClipBoard(index)}>
                                <button className="copy-to-clipboard"><div className="fa fa-copy"></div> Copy to clipboard</button>
                            </CopyToClipboard>
                        </div>
                        <div className="copy-box" style={{ "position": "absolute", "z-index": "9", "left": "180px", "bottom": "10px" }}>
                            <button className="copy-to-clipboard" onClick={() => this.editWebsite(res)}>Edit</button>
                        </div>
                        <div className="copy-box" style={{ "position": "absolute", "z-index": "9", "left": "235px", "bottom": "10px" }}>
                            <button className="copy-to-clipboard" onClick={() => this.deleteWebsite(res)}>Delete</button>
                        </div>
                        <div className="copy-box" style={{ "position": "absolute", "z-index": "9", "left": "235px", "bottom": "10px" }}>
                            <button className="copy-to-clipboard" onClick={() => this.export(res)}>Export</button>
                        </div>
                    </div>
                </div>
            ));
        }
        else if (this.state.isLength == false) {
            return <div className="p-4"><h3>Loading...</h3></div>
        }
        else {
            return <div className="p-4"><h2>No Record Found.</h2></div>
        }
    }

    /** Edit website */
    editWebsite(data) {
        this.props.onHistory.push({ pathname: "/websiteEdit", websiteId: data._id });
    }

    /** delete website */
    deleteWebsite(data) {
        const x = window.confirm("Are you sure to delete this website?");
        if (x == true) {
            let websiteId = data._id;
            if (websiteId) {

                deleteWebsiteById(websiteId).then((res) => {

                    let websitesLengthData = localStorage.getItem("websiteAdded");
                    localStorage.setItem("websiteAdded", websitesLengthData - 1);
                    if (res) {
                        const data = {
                            id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
                            page: this.state.pageNumber
                        };

                        getAllWebsitesByUserIdWithPagination(data).then((res) => {

                            if (res.data.success == true) {
                                this.setState({
                                    totalData: res.data.data.message,
                                    totalItemsData: res.data.data.message,
                                    dispalyWebsiteCount: res.data.data.totalCount,
                                    totalItems: res.data.data.totalCount,
                                    // lastInsertedWebsite: res.data.data.message[0],
                                    totalItemsCount: res.data.data.totalCount,
                                    isNotShowing: true
                                });
                                this.setState({
                                    isLength: true
                                });

                                if (this.state.totalData.length != 0) {
                                    for (let k = 0; k < this.state.totalData.length; k++) {
                                        hiddenClipBoard[k] = true;
                                    }
                                }

                                if (this.state.dispalyWebsiteCount.length != 0) {
                                    localStorage.setItem("websiteAdded", this.state.dispalyWebsiteCount);
                                }

                                this.props.onHistory.push({ pathname: '/list' });
                            }
                        }).catch((err) => {
                            this.setState({
                                isLength: true
                            });

                        });

                        /** getting websites tags */
                        getWebsiteTags(JSON.parse(localStorage.getItem("catchLetterDetails"))._id).then((res) => {
                            if (res.data.success == true) {
                                this.setState({
                                    Tags: res.data.data
                                });
                            }
                        }).catch((error) => {
                            console.log("err");
                        });

                    }
                }).catch((error) => {
                    NotificationManager.error("Please try again later.", "Error");
                });
            }
        }
    }

    /** go specific website mails */
    goMailsByWebsite(value) {
        const data = {
            emailDomain: value.emailDomain,
            unique_id: value.unique_id,
            websiteId: value._id,
            dispalyWebsiteCount: this.state.dispalyWebsiteCount,
            tags: value.tags,
            website_name: value.website_name,
            _id: value._id
        };
        this.props.onHistory.push({ pathname: "/websiteMails/" + btoa(value._id), value: data })
    }

    /** search websites name */
    searchWebsites() {
        let requestBody = {};
        let value = this.state.inputText;

        requestBody.id = JSON.parse(localStorage.getItem("catchLetterDetails"))._id;
        requestBody.size = this.state.pageSize;

        if (this.state.inputText) {
            requestBody.subject = this.state.inputText;
        }
        if (this.state.tags && this.state.tags != "alltags") {
            requestBody.tags = this.state.tags;
        }


        this.setState({
            isLength: false
        });

        getAllWebsitesByUserIdWithPagination(requestBody).then((res) => {

            this.setState({
                isLength: true
            });
            if (res.data.success == true) {
                if (res.data.success == true) {
                    this.setState({
                        totalData: res.data.data.message
                    });
                }
            }
        }).catch((error) => {

            this.setState({
                isLength: true,
                totalData: []
            })
            NotificationManager.error("Please try again later.", "Error");
        });
    }

    closeDisplayMessage() {

        if (this.state.lastInsertedWebsite && this.state.lastInsertedWebsite.length != 0) {
            this.setState({
                isNotShowing: true
            });
        }
    }

    displayLastWebsiteName() {
        if (this.state.lastInsertedWebsite && this.state.lastInsertedWebsite.length != 0 && this.state.isNotShowing == false) {

            return (
                <div hidden={this.state.isNotShowing} className="alert alert-info">
                    <i className="fa fa-times text-success mr-1" onClick={() => this.closeDisplayMessage()}></i>
                    <strong>
                        We have added {this.state.lastInsertedWebsite.website_name} .You now need to sign up to their newsletters using email address {this.state.lastInsertedWebsite.emailDomain}
                    </strong>
                </div>
            )
        }
    }

    goCreateWebsite() {
        this.props.onHistory.push({ pathname: "/createWebsites" });
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
        if (this.state.tags) {
            requestBody.tags = this.state.tags;
        }
        requestBody.page = pageNumber;

        getAllWebsitesByUserIdWithPagination(requestBody).then((res) => {
            if (res.data.success == true) {

                this.setState({
                    totalData: res.data.data.message
                });
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
            <div className="body-area-custom">
                <section className="top-bar-row py-5">
                    <div className="container">
                        {this.displayLastWebsiteName()}
                        {/* <div class="alert alert-info">
                        <i className="fa fa-check text-success mr-1"></i><strong>We added {this.state.websiteName} .You need to sign up their newsletters using email address {this.state.}</strong>
                    </div> */}
                        <div className="d-flex justify-content-between website" style={{ "padding-bottom": "1.5em" }}>
                            <h1 className="heading-font">Websites</h1>
                            <button type="button" className="btn btn-primary website-btn" onClick={() => this.goCreateWebsite()}>
                                <i className="fa fa-plus" />
                                Add website to monitor
                        </button>
                        </div>
                        <div className="filter-bar py-3">
                            <div className="row d-md-flex website">
                                <div className="col-md-12 col-lg-5 col-8 d-flex justify-content-start align-items-center ">
                                    <h6 className="mb-0 ml-0">We're monitoring {this.state.dispalyWebsiteCount} websites for you right now.</h6>
                                    {/* <span>You can add another 2 websites for free</span> */}
                                </div>


                                {/* <div className="col-md-3 col-4 text-center">
                                <div className="input-box btsp-dropdown">
                                    <a href="javascript:void(0)" className="dropdown-toggle selected-btn" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{this.state.tagName}<span className="caret" />
                                    </a>
                                    <ul className="dropdown-menu p-3 sub-droped-down">
                                        <li><a href="javascript:void(0)" onClick={() => this.showAllWebsites('All website tags')}>All website tags</a></li>
                                        {
                                            this.state.Tags.length != 0 ?
                                                this.state.Tags.map((res, index) => (
                                                    <li key={index}><a href="javascript:void(0)" onClick={() => this.findTagsOnInput(res.text)}>{res.text}</a></li>
                                                )) : ''
                                        }
                                    </ul>
                                </div>
                            </div> */}


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

                                <div className="col-12 col-md-6 col-lg-1">
                                    <div className="f-bx input-box">
                                        <select className="form-control" name="pageSize" onChange={this.handlePageNumberChange.bind(this)}>
                                            {
                                                this.state.pageSizeOne.length != 0 ? this.state.pageSizeOne.map((result, i) =>
                                                    <option key={i} value={result.val}>{result.val}</option>
                                                ) : (
                                                        ''
                                                    )
                                            }
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6 col-lg-3">
                                    {/* <input id="search" name="search" placeholder="Search for a website you monitor" class="input-field"> */}
                                    <div className="input-box clearfix">
                                        <input id="search" name="inputText" placeholder="Search for a website you monitor" className="input-field" onChange={this.handleChange.bind(this)} value={this.state.inputText} />
                                        <button className="right-btn" type="submit" onClick={() => this.searchWebsites()}> <i className="fa fa-search" /></button>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="all-website-list">
                            {this.displayWebsite()}
                        </div>
                        <div className="d-md-flex py-3 align-items-center justify-content-center">
                            <ul id="page-numbers" className="list-inline">
                                {/* {renderPageNumbers} */}
                                <Pagination
                                    activePage={this.state.pageNumber}
                                    itemsCountPerPage={10}
                                    totalItemsCount={this.state.totalItemsCount}
                                    pageRangeDisplayed={2}
                                    onChange={this.handlePageChange.bind(this)}
                                />
                            </ul>
                        </div>
                        {/* <div className="page-navigation">
                        <div>
                            <ul id="page-numbers">
                               {this.renderTodos()}
                            </ul>
                        </div>
                    </div> */}
                    </div>
                </section>
            </div>
        );
    }
}

export default WebsitesList;