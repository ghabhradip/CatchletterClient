import React, { Component } from 'react';
import { connect } from 'react-redux';

import CreateWebsite from '../Websites/Websites';
import WebsitesList from '../WebsitesList/WebsitesList';
import FavouriteEmails from '../FavouriteEmails/FavouriteEmails';
import Billing from '../Billing/Billing';
import Alert from '../Alert/Alert';

import Profile from '../Profile/Profile';
import { bindActionCreators } from 'redux';

import {
    getCustomerById,
    getBillingData,
    getwebsitebydatecheck,
    getAllWebsitesByUserIdWithPagination,
    getSubscriptionPlan,
    lastSubscriptionDetails
} from '../../../api/commonApi';

import _userImage from '../../_userImage';
import { showHeader } from '../../../../redux/actions';

let addMaximumWebsite;

let IsLoggedIn = false;

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hiddenHeader: true,
            userData: '',
            dashboardClassName: 'nav-link active',
            displayWebsiteClassName: 'nav-link',
            favouriteEmail: 'nav-link',
            inboxClass: 'nav-link',
            billingClass: 'nav-link',
            alertClass: 'nav-link',
            customDomainClass: 'nav-link',
            proFileImage: '',
            expireMessage: '',
            addMaximumWebsite: 0,
            websiteAdded: 0,
            showAlertForWebsite: false,
            isShow: false
        }
        if (localStorage.getItem("catchLetterDetails")) {
            IsLoggedIn = true;
        }

        if (IsLoggedIn == false) {
            if (this.props.location && this.props.location.pathname.includes("/activateLink")) {

            }
            else if (this.props.location && this.props.location.pathname.includes("/setpassword")) {

            }
            else if (this.props.location && this.props.location.pathname.includes("/billing")) {

            }
            else if (this.props.location && this.props.location.pathname.includes("/resetPassword")) {

            }
            else {
                this.props.history.push({
                    pathname: '/'
                });
            }

        }

        const url = window.location.href;

        if (url.includes('inbox')) {
            setTimeout(() => {
                this.setState({
                    hiddenHeader: false,
                    dashboardClassName: 'nav-link ',
                    displayWebsiteClassName: 'nav-link',
                    favouriteEmail: 'nav-link',
                    inboxClass: 'nav-link active',
                    billingClass: 'nav-link',
                    alertClass: 'nav-link',
                    customDomainClass: 'nav-link'
                });
            }, 100)

        } else if (url.includes('dashboard')) {

            setTimeout(() => {
                this.setState({
                    hiddenHeader: false,
                    dashboardClassName: 'nav-link active',
                    displayWebsiteClassName: 'nav-link',
                    favouriteEmail: 'nav-link',
                    inboxClass: 'nav-link',
                    billingClass: 'nav-link',
                    alertClass: 'nav-link',
                    customDomainClass: 'nav-link'
                });
            }, 100)

        }
        else if (url.includes('websites')) {

            setTimeout(() => {
                this.setState({
                    hiddenHeader: false,
                    dashboardClassName: 'nav-link',
                    displayWebsiteClassName: 'nav-link active',
                    favouriteEmail: 'nav-link',
                    inboxClass: 'nav-link',
                    billingClass: 'nav-link',
                    alertClass: 'nav-link',
                    customDomainClass: 'nav-link'
                });
            }, 100)

        }
        else if (url.includes('favourite')) {
            setTimeout(() => {
                this.setState({
                    hiddenHeader: false,
                    dashboardClassName: 'nav-link',
                    displayWebsiteClassName: 'nav-link',
                    favouriteEmail: 'nav-link active',
                    inboxClass: 'nav-link',
                    billingClass: 'nav-link',
                    alertClass: 'nav-link',
                    customDomainClass: 'nav-link'
                });
            }, 100)
        }
        else if (url.includes('websiteMails')) {
            setTimeout(() => {
                this.setState({
                    hiddenHeader: false,
                    dashboardClassName: 'nav-link',
                    displayWebsiteClassName: 'nav-link active',
                    favouriteEmail: 'nav-link',
                    inboxClass: 'nav-link',
                    billingClass: 'nav-link',
                    alertClass: 'nav-link',
                    customDomainClass: 'nav-link'
                });
            }, 100)
        }
        else if (url.includes('billing')) {
            setTimeout(() => {
                this.setState({
                    hiddenHeader: false,
                    dashboardClassName: 'nav-link',
                    displayWebsiteClassName: 'nav-link',
                    favouriteEmail: 'nav-link',
                    inboxClass: 'nav-link',
                    billingClass: 'nav-link active',
                    alertClass: 'nav-link',
                    customDomainClass: 'nav-link'
                });
            }, 100)
        }
        else if (url.includes('custom-domain')) {
            setTimeout(() => {
                this.setState({
                    hiddenHeader: false,
                    dashboardClassName: 'nav-link',
                    displayWebsiteClassName: 'nav-link',
                    favouriteEmail: 'nav-link',
                    inboxClass: 'nav-link',
                    billingClass: 'nav-link',
                    alertClass: 'nav-link',
                    customDomainClass: 'nav-link active'
                });
            }, 100)
        }
    }

    logout() {
        localStorage.clear();
        setTimeout(() => {
            this.setState({
                hiddenHeader: true,
                showAlertForWebsite: false
            });
        }, 100);
        this.props.history.push({ pathname: "/" });
    }

    goPaymentPage() {
        this.props.history.push({ pathname: "/billing" });
    }

    componentDidUpdate(prevProps) {
        if (this.props && this.props.location && this.props.location.pathname.includes("/emailDetail")) {
            if (prevProps.location.pathname == "/websiteMails") {
                setTimeout(() => {
                    this.setState({
                        hiddenHeader: false,
                        dashboardClassName: 'nav-link',
                        displayWebsiteClassName: 'nav-link active',
                        favouriteEmail: 'nav-link',
                        inboxClass: 'nav-link',
                        billingClass: 'nav-link',
                        alertClass: 'nav-link',
                        customDomainClass: 'nav-link'
                    });
                }, 100)
            }
            else if (prevProps.location.pathname == "/inbox") {
                setTimeout(() => {
                    this.setState({
                        hiddenHeader: false,
                        dashboardClassName: 'nav-link',
                        displayWebsiteClassName: 'nav-link',
                        favouriteEmail: 'nav-link',
                        inboxClass: 'nav-link active',
                        billingClass: 'nav-link',
                        alertClass: 'nav-link',
                        customDomainClass: 'nav-link'
                    });
                }, 100)
            }
            else if (prevProps.location.pathname == "/favouriteEmails") {
                setTimeout(() => {
                    this.setState({
                        hiddenHeader: false,
                        dashboardClassName: 'nav-link',
                        displayWebsiteClassName: 'nav-link',
                        favouriteEmail: 'nav-link active',
                        inboxClass: 'nav-link',
                        billingClass: 'nav-link',
                        alertClass: 'nav-link',
                        customDomainClass: 'nav-link'
                    });
                }, 100)
            }
        }

        if (this.props && this.props.location && this.props.location.pathname == "/billing") {
            setTimeout(() => {
                this.setState({
                    hiddenHeader: false,
                    dashboardClassName: 'nav-link',
                    displayWebsiteClassName: 'nav-link',
                    favouriteEmail: 'nav-link',
                    inboxClass: 'nav-link',
                    billingClass: 'nav-link active',
                    alertClass: 'nav-link',
                    customDomainClass: 'nav-link'
                });
            }, 100)
        }

        if (this.props && this.props.location && this.props.location.pathname == "/favourite") {
            setTimeout(() => {
                this.setState({
                    hiddenHeader: false,
                    dashboardClassName: 'nav-link',
                    displayWebsiteClassName: 'nav-link',
                    favouriteEmail: 'nav-link active',
                    inboxClass: 'nav-link',
                    billingClass: 'nav-link',
                    alertClass: 'nav-link',
                    customDomainClass: 'nav-link'
                });
            }, 100)
        }

        if (this.props && this.props.location && this.props.location.pathname == "/inbox") {
            setTimeout(() => {
                this.setState({
                    hiddenHeader: false,
                    dashboardClassName: 'nav-link',
                    displayWebsiteClassName: 'nav-link',
                    favouriteEmail: 'nav-link',
                    inboxClass: 'nav-link active',
                    billingClass: 'nav-link',
                    alertClass: 'nav-link',
                    customDomainClass: 'nav-link'
                });
            }, 100)
        }

        if (this.props && this.props.location && this.props.location.pathname == "/list") {
            setTimeout(() => {
                this.setState({
                    hiddenHeader: false,
                    dashboardClassName: 'nav-link',
                    displayWebsiteClassName: 'nav-link active',
                    favouriteEmail: 'nav-link',
                    inboxClass: 'nav-link',
                    billingClass: 'nav-link',
                    alertClass: 'nav-link',
                    customDomainClass: 'nav-link'
                });
            }, 100)
        }

        if (this.props && this.props.location && this.props.location.pathname == "/home") {
            setTimeout(() => {
                this.setState({
                    hiddenHeader: false,
                    dashboardClassName: 'nav-link active',
                    displayWebsiteClassName: 'nav-link',
                    favouriteEmail: 'nav-link',
                    inboxClass: 'nav-link',
                    billingClass: 'nav-link',
                    alertClass: 'nav-link',
                    customDomainClass: 'nav-link'
                });
            }, 100)
        }

        if (this.props && this.props.location && this.props.location.pathname == "/alerts") {
            setTimeout(() => {
                this.setState({
                    hiddenHeader: false,
                    dashboardClassName: 'nav-link',
                    displayWebsiteClassName: 'nav-link',
                    favouriteEmail: 'nav-link',
                    inboxClass: 'nav-link',
                    billingClass: 'nav-link',
                    alertClass: 'nav-link active',
                    customDomainClass: 'nav-link'
                });
            }, 100)
        }

        if (this.props && this.props.location && this.props.location.pathname == "/custom-domain") {
            setTimeout(() => {
                this.setState({
                    hiddenHeader: false,
                    dashboardClassName: 'nav-link',
                    displayWebsiteClassName: 'nav-link',
                    favouriteEmail: 'nav-link',
                    inboxClass: 'nav-link',
                    billingClass: 'nav-link',
                    alertClass: 'nav-link',
                    customDomainClass: 'nav-link active'
                });
            }, 100)
        }

    }


    componentDidMount() {

        if (this.props.userData[0]) {
            localStorage.setItem("catchLetterDetails", JSON.stringify(this.props.userData[0]));
        }

        if (localStorage.getItem("websiteAdded")) {
            this.setState({
                websiteAdded: localStorage.getItem("websiteAdded"),
                showAlertForWebsite: true
            });
        }

        if (localStorage.getItem("catchLetterDetails")) {
            const value = JSON.parse(localStorage.getItem("catchLetterDetails"));

            this.props.showHeader(true);
            this.setState({
                hiddenHeader: true
            });

            const valueOne = {
                current_date: new Date(),
                userId: value._id
            };

            getwebsitebydatecheck(valueOne).then((res) => {
                if (res.data.success == true) {
                    const message = res.data.data.message;
                    if (message == "You are within billing date.") {

                        const billingData = {
                            userId: value._id
                        };
                        let messageOne;
                        getBillingData(billingData).then((result1) => {


                            if (result1.data.success == true) {
                                // let billingDate = result1.data.data.details[0].details[result1.data.data.details[0].details.length - 1].billingDetails[0].billingDate;
                                let billingExpiryValue = result1.data.data.details[0].details[result1.data.data.details[0].details.length - 1].billingDetails[0].expiryDate;
                                if (billingExpiryValue) {
                                    addMaximumWebsite = 0;

                                    var date2 = new Date(billingExpiryValue);
                                    var date1 = new Date();
                                    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                                    let val = Math.ceil(timeDiff / (1000 * 3600 * 24));

                                    lastSubscriptionDetails(value._id).then((lastdata) => {
                                        if (lastdata.data.success == true) {
                                            this.setState({
                                                addMaximumWebsite: lastdata.data.data.websitesNumber
                                            });
                                        }
                                    }).catch((err) => {
                                        console.log("err");
                                    });

                                    // let planDetails = result1.data.data.details[0].details[result1.data.data.details[0].details.length - 1].planDetails[0];
                                    // if (planDetails) {

                                    //     getSubscriptionPlan().then((res10) => {

                                    //         if (res10.data.data.subscriptionData.length != 0) {
                                    //             res10.data.data.subscriptionData.map((result10) => {
                                    //                 if (result10.planId == planDetails.planId) {
                                    //                     addMaximumWebsite = result10.noOfWebsites;

                                    //                 }
                                    //             });
                                    //             if (addMaximumWebsite != 0) {
                                    //                 this.setState({
                                    //                     addMaximumWebsite: parseInt(addMaximumWebsite),
                                    //                     isShow: true
                                    //                 });
                                    //             }
                                    //         }
                                    //     }).catch((err) => {
                                    //         console.log("err");
                                    //     });
                                    // }

                                    if (val == 0) {
                                        messageOne = "Your plan is going to expire today";
                                    } else if (val == 7) {
                                        messageOne = "Your default plan will expire in " + val + " day(s)";
                                    } else if (val == 30) {
                                        messageOne = "Your plan will expire in " + val + " day(s)";
                                    } else if (val > 32) {
                                        messageOne = ''
                                    }
                                    if (val != NaN) {
                                        this.setState({
                                            expireMessage: messageOne
                                        });
                                    }
                                }
                            }
                        }).catch((error) => {
                            console.log("err");
                        });
                    } else if (message == "Billing date is expired.") {
                        this.props.onHistory.push({ pathname: '/billingExpire' });
                    }
                }
            }).catch((error) => {

            });

            getCustomerById(JSON.parse(localStorage.getItem("catchLetterDetails"))._id).then((res) => {
                if (res.data.success == true) {
                    if (res.data.data.userDetails.imageFileName) {
                        const imgUrl = _userImage + res.data.data.userDetails.imageFileName;
                        this.setState({
                            proFileImage: imgUrl
                        });
                    } else {
                        this.setState({
                            proFileImage: ''
                        });
                    }
                }
            }).catch((error) => {
                this.setState({
                    proFileImage: ''
                })
            });
            this.setState({
                hiddenHeader: false
            });
        }
    }

    componentWillReceiveProps() {
        if (this.props.userHeader && this.props.userHeader == true) {
            this.setState({
                hiddenHeader: true
            });
        }

        if (this.props.userHeader && this.props.userHeader == false) {
            this.setState({
                hiddenHeader: false
            });
        }

        if (localStorage.getItem("catchLetterDetails")) {
            if (JSON.parse(localStorage.getItem("catchLetterDetails")).imageFileName) {
                const imgUrl = _userImage + JSON.parse(localStorage.getItem("catchLetterDetails")).imageFileName;
                this.setState({
                    // hiddenHeader: false,
                    proFileImage: imgUrl
                });
            } else {
                this.setState({
                    proFileImage: ''
                });
            }
        }
        if (!localStorage.getItem("catchLetterDetails")) {
            this.setState({ hiddenHeader: true });
        }

        if (localStorage.getItem("websiteAdded")) {
            let websiteAdded = localStorage.getItem("websiteAdded");
            if (websiteAdded) {
                this.setState({
                    websiteAdded: websiteAdded,
                    showAlertForWebsite: true
                });
            }
        }
    }

    showDashboard(value) {
        if (value == "dashboard") {
            this.setState({
                dashboardClassName: 'nav-link active',
                displayWebsiteClassName: 'nav-link',
                favouriteEmail: 'nav-link',
                inboxClass: 'nav-link',
                billingClass: 'nav-link',
                alertClass: 'nav-link',
                customDomainClass: 'nav-link'
            });
            this.props.history.push({ pathname: "/home" });
        }
    }

    showDisplayWebsite(value) {
        if (value == "websiteslist") {
            this.setState({
                displayWebsiteClassName: 'nav-link active',
                dashboardClassName: 'nav-link',
                favouriteEmail: 'nav-link',
                inboxClass: 'nav-link',
                billingClass: 'nav-link',
                alertClass: 'nav-link',
                customDomainClass: 'nav-link'
            });
            this.props.history.push({ pathname: "/list" });
        }
    }

    favouriteEmail(value) {
        if (value == "favouriteEmail") {
            this.setState({
                favouriteEmail: 'nav-link active',
                displayWebsiteClassName: 'nav-link',
                dashboardClassName: 'nav-link',
                inboxClass: 'nav-link',
                billingClass: 'nav-link',
                alertClass: 'nav-link',
                customDomainClass: 'nav-link'
            });
        }
        this.props.history.push({ pathname: "/favourite" });
    }

    openCreateWebsite() {
        this.props.history.push({ pathname: "/createWebsites" })
        this.setState({
            dashboardClassName: 'nav-link',
            displayWebsiteClassName: 'nav-link'
        });
    }
    openInbox(value) {
        if (value == "inbox") {
            this.setState({
                dashboardClassName: 'nav-link',
                favouriteEmail: 'nav-link',
                displayWebsiteClassName: 'nav-link',
                inboxClass: 'nav-link active',
                billingClass: 'nav-link',
                alertClass: 'nav-link',
                customDomainClass: 'nav-link'
            });
        }
        this.props.history.push({
            pathname: "/inbox"
        })
    }

    goBilling(value) {
        if (value == "billing") {
            this.setState({
                dashboardClassName: 'nav-link',
                favouriteEmail: 'nav-link',
                displayWebsiteClassName: 'nav-link',
                inboxClass: 'nav-link',
                billingClass: 'nav-link active',
                alertClass: 'nav-link',
                customDomainClass: 'nav-link'
            });
        }
        this.props.history.push({ pathname: '/billing' });
    }

    goProfile() {
        this.props.history.push({ pathname: "/profile" });
        this.setState({
            dashboardClassName: 'nav-link',
            displayWebsiteClassName: 'nav-link'
        });
    }

    goAlert(value) {
        if (value == "alert") {
            this.setState({
                dashboardClassName: 'nav-link',
                favouriteEmail: 'nav-link',
                displayWebsiteClassName: 'nav-link',
                inboxClass: 'nav-link',
                billingClass: 'nav-link',
                alertClass: 'nav-link active',
                customDomainClass: 'nav-link'
            });
        }
        this.props.history.push({ pathname: "/alerts" });
    }

    goCustomDomain(value) {
        if (value == "custom-domain") {
            this.setState({
                dashboardClassName: 'nav-link',
                favouriteEmail: 'nav-link',
                displayWebsiteClassName: 'nav-link',
                inboxClass: 'nav-link',
                billingClass: 'nav-link',
                alertClass: 'nav-link',
                customDomainClass: 'nav-link active'

            });
        }
        this.props.history.push({ pathname: "/custom-domain" });
    }

    showImage() {
        if (this.state.proFileImage) {
            return <img src={this.state.proFileImage} className="img-fluid" alt="profile pic" />
        }
        else {
            return <img src={require('../../../../assets/images/dummy-profile.png')} className="img-fluid" alt="profile pic" />
        }
    }

    onBellPress() {
        if (localStorage.getItem("catchLetterDetails")) {
            const value = JSON.parse(localStorage.getItem("catchLetterDetails"));
            window.test(value.first_name, value.last_name, value.email, value._id);
        }
        // window.test();
    }

    render() {

        return (
            <header hidden={this.state.hiddenHeader}>

                {/* Navigation */}
                <nav className="navbar navbar-expand-lg shadow-sm">
                    <div className="container">
                        {/* {
                            this.state.expireMessage.length != 0 ?
                                <div className="alert alert-warning" role="alert">


                                    {this.state.expireMessage}, please enter your <a style={{ color: "#007bff", cursor: "pointer" }} onClick={() => this.goPaymentPage()}>payment details</a> in order to continue to use catchLetter and to not lose your email history
                                </div> : ''

                        } */}

                        <a className="navbar-brand" onClick={() => this.props.history.push({ pathname: "/home" })}>
                            <img src={require('../../../../assets/images/logo.png')} style={{ "cursor": "pointer" }} className="img-fluid" alt="logo" />
                        </a>
                        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"><i className="ti-align-right" /></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarResponsive">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <a className={this.state.dashboardClassName} href="javascript:void(0)" onClick={() => this.showDashboard('dashboard')}>Dashboard</a>
                                </li>
                                <li className="nav-item">
                                    <a className={this.state.displayWebsiteClassName} href="javascript:void(0)" onClick={() => this.showDisplayWebsite('websiteslist')}>Websites</a>
                                </li>
                                <li className="nav-item">
                                    <a className={this.state.inboxClass} href="javascript:void(0)" onClick={() => this.openInbox('inbox')}>Inbox</a>
                                </li>
                                <li className="nav-item ">
                                    <a className={this.state.favouriteEmail} href="javascript:void(0)" onClick={() => this.favouriteEmail('favouriteEmail')}> Favourite Email </a>
                                </li>
                                <li className="nav-item ">
                                    <a className={this.state.alertClass} href="javascript:void(0)" onClick={() => this.goAlert('alert')}> Alerts </a>
                                </li>
                                <li className="nav-item ">
                                    <a className={this.state.customDomainClass} href="javascript:void(0)" onClick={() => this.goCustomDomain('custom-domain')}> Custom Domains </a>
                                </li>
                                <li className="nav-item ">
                                    <a className={this.state.billingClass} href="javascript:void(0)" onClick={() => this.goBilling('billing')}> Billing </a>
                                </li>
                            </ul>
                        </div>
                        <div className="ml-auto notify-area">
                            <div className=" clearfix">
                                <div className="pull-right notify">
                                    <ul className="list-inline">
                                        <li className="dropdown bell-icon-top">
                                            <a className="btn dropdown-toggle beamerButton" onClick={() => this.onBellPress()} id="beamerButton">
                                                <i className="fa fa-bell" />
                                            </a>
                                        </li>
                                        <li className="dropdown  plus-top-icon">
                                            <a className="btn" href="javascript:void(0)" onClick={() => this.openCreateWebsite()}>
                                                <i className="fa fa-plus-circle">

                                                </i>
                                            </a>
                                            {/* <button className="btn btn-primary dropdown-toggle" type="button" id="plus" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={() => this.openCreateWebsite()}>
                                                
                                            </button> */}
                                            {/* <div aria-labelledby="plus">
                                                <a className="dropdown-item" href="javascript:void(0)" onClick={() => this.props.history.push({ pathname: "/websites" })}>Create New Website</a>
                                                <a className="dropdown-item" href="javascript:void(0)" onClick={() => this.props.history.push({ pathname: "/WebsitesList" })}>Websites List</a>
                                            </div> */}

                                        </li>

                                        <li className="dropdown">
                                            <a className="btn dropdown-toggle" id="profile" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                {this.showImage()}
                                                {/* <img src={require('../../../../assets/images/dummy-profile.png')} className="img-fluid" alt="profile pic" /> */}
                                            </a>
                                            <div className="dropdown-menu" aria-labelledby="profile" style={{ 'marginTop': '10px' }}>
                                                <a className="dropdown-item" href="javascript:void(0)" onClick={() => this.goProfile()}>My Account</a>
                                                {/* <a className="dropdown-item" href="javascript:void(0)">Dashboard</a> */}
                                                <a className="dropdown-item" href="javascript:void(0)" onClick={() => this.logout()}>Logout</a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="pull-right settingsc">
                                    <div className="dropdown">
                                        <a className="btn dropdown-toggle" href="javascript:void(0)" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {/* <i className="fa fa-gear" /> */}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                {/*end of navigation*/}
                {
                    this.state.expireMessage ?
                        <div className="alert alert-warning mt-0 mb-0" role="alert">
                            {this.state.expireMessage}, please enter your <a style={{ color: "#007bff", cursor: "pointer" }} onClick={() => this.goPaymentPage()}>payment details</a> in order to continue to use catchLetter and to not lose your email history
                                </div> : ''

                }
                {
                    this.state.websiteAdded != 0 && this.state.addMaximumWebsite != 0 && this.state.addMaximumWebsite < 100 && this.state.showAlertForWebsite == true ?
                        <div className="alert alert-warning mt-0 mb-0" role="alert">


                            Total {this.state.websiteAdded} website(s) added out of {this.state.addMaximumWebsite}
                        </div> : ''
                }
                {/* <div className="alert alert-warning mt-0 mb-0" role="alert">


please enter your <a style={{ color: "#007bff", cursor: "pointer" }} onClick={() => this.goPaymentPage()}>payment details</a> in order to continue to use catchLetter and to not lose your email history
</div> */}


            </header >
        )
    }
}

function mapStateToProps(state) {
    return {
        userData: state.userAuth,
        userImage: state.userImage,
        showHeader: state.showHeader
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ showHeader }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);