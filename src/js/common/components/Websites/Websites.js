import React, { Component } from 'react';
import {
    addWebsite,
    getwebsitebydatecheck,
    getBillingData
} from '../../../api/commonApi';
import { WithContext as ReactTags } from 'react-tag-input';
import { NotificationManager } from 'react-notifications';
import Login from '../Login/Login';

const KeyCodes = {
    comma: 188,
    enter: 13,
};
const errorClass = {
    color: 'red',
    display: 'none'
};

let IsValid = true;
const delimiters = [KeyCodes.comma, KeyCodes.enter];

let IsLoggedIn = false;

class CreateWebsite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            website_name: '',
            homepage_url: '',
            tags: [],
            user_id: '',
            specialKeys: [
                8, 9, 46, 36, 35, 37, 39
            ],
            expireMessage: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);

        if (localStorage.getItem("catchLetterDetails")) {
            IsLoggedIn = true;
        }
        if (IsLoggedIn == false) {
            this.props.onHistory.push({ pathname: '/' });
        }
    }

    // handleKeyPress = (e) => {
    //     var keyCode = e.keyCode === 0 ? e.charCode : e.keyCode;
    //     var ret = ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (this.state.specialKeys.indexOf(e.keyCode) !== -1 && e.charCode !== e.keyCode));
    //     document.getElementById("error").style.display = ret ? "none" : "inline";
    //     IsValid = ret;
    //     return ret;
    // }
    componentDidMount() {
        window.scrollTo(0, 0);
        let value;
        let messageOne;
        if (localStorage.getItem("catchLetterDetails")) {
            const userData = JSON.parse(localStorage.getItem("catchLetterDetails"));

            if (userData) {
                this.setState({ user_id: userData._id });

                const valueOne = {
                    current_date: new Date(),
                    userId: userData._id
                };

                getwebsitebydatecheck(valueOne).then((res) => {
                    if (res.data.success == true) {
                        const message = res.data.data.message;
                        if (message == "You are within billing date.") {

                            // billing data
                            const billingData = {
                                userId: userData._id
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

                        } else if (message == "Billing date is expired.") {
                            this.props.onHistory.push({ pathname: '/billingExpire' });
                        }
                    }
                }).catch((error) => {
                    console.log("err :", error);
                });

            }
        }
        else {
            this.props.onHistory.push({ pathname: '/' });
            NotificationManager.error("Please login first.", "Error");
        }
    }
    handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }

    handleDelete(i) {
        const { tags } = this.state;
        this.setState({
            tags: tags.filter((tag, index) => index !== i),
        });
    }

    handleChange(event) {
        if (event.target.name !== "website_name") {
            var change = {};
            change[event.target.name] = event.target.value;
            this.setState(change);
        }
        else {
            if (IsValid) {
                var changeOne = {};
                changeOne[event.target.name] = event.target.value;
                this.setState(changeOne);
            }
        }
    }

    handleSubmit(event) {
        if (this.state.website_name && this.state.homepage_url) {
            let tags = [];
            this.state.tags.map((item) => {
                tags.push({ text: item.text });
            })
            const data = {
                website_name: this.state.website_name,
                homepage_url: this.state.homepage_url,
                tags: tags,
                user_id: this.state.user_id
            };

            addWebsite(data).then((res) => {
                if (res.data.success === true) {
                    localStorage.setItem("websiteAdded", res.data.data.totalWebsitesCount);
                    NotificationManager.success(res.data.data.message, "Success");
                    this.props.onHistory.push({ pathname: '/list', value: "websiteInserted" });
                }
                else {
                    console.log("err");
                }
            }).catch((err) => {

                if (err.response.data.success === false) {
                    NotificationManager.error(err.response.data.data.message, "Error");
                }
            });
        }
        else {
            NotificationManager.error("Website name and Home Page Url are required.", "Error");
        }
        event.preventDefault();
    }

    goPaymentPage() {
        this.props.onHistory.push({ pathname: "/billing" });
    }

    render() {
        return (
            <section id="main-body" className="d-flex justify-content-center align-items-center">

                <div className="container">
                    {
                        this.state.expireMessage.length != 0 ?
                            <div className="alert alert-warning" role="alert">

                                {/* Your plan will expire in {this.state.billingExpiryValue} days, please enter your <a style={{ color: "#007bff", cursor: "pointer" }} onClick={() => this.goPaymentPage()}>payment details</a> in order to continue to use catchLetter and to not lose your email history */}
                                {this.state.expireMessage}, please enter your <a style={{ color: "#007bff", cursor: "pointer" }} onClick={() => this.goPaymentPage()}>payment details</a> in order to continue to use catchLetter and to not lose your email history
                                </div> : ''

                    }
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="col-12 main-content">
                                <div className="logincontainer with-social website-edit-form">
                                    <div className="header-lined">

                                        <h2 className="website-edit-header">Create Website</h2>

                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="inputEmail">Website Name <span className="text-danger">*</span></label>
                                                <input type="text" className="form-control" autoFocus id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Website Name" name="website_name" onChange={this.handleChange.bind(this)} value={this.state.website_name} required minLength="3" />
                                                {/* <span id="error" style={errorClass}>* Special Characters not allowed</span> */}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputPassword">Homepage Url <span className="text-danger">*</span></label>
                                                <input type="text" className="form-control" id="exampleInputEmail2" aria-describedby="emailHelp" placeholder="Homepage Url" name="homepage_url" onChange={this.handleChange.bind(this)} value={this.state.homepage_url} required minLength="3" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputPassword">Keywords for your website</label>
                                                <ReactTags tags={this.state.tags}
                                                    handleDelete={this.handleDelete}
                                                    handleAddition={this.handleAddition}
                                                    delimiters={delimiters} />
                                                <small className="d-block p-1 text-muted">Please press enter after write tag.</small>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input id="login" type="submit" className="btn btn-primary btn-block btn-sm" defaultValue="Submit" />
                                            </div>
                                            <button type="button" class="btn btn-primary btn-block btn-sm" onClick={() => this.props.onHistory.push({ pathname: "/" })}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                </div>

            </section>

            // <div>
            //     Create Website
            //         <form className="my-4" onSubmit={this.handleSubmit}>
            //         <div className="row mt-4 form">
            //             <div className="col-md-6">
            //                 <div className="form-group">
            //                     <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Website Name" name="website_name" onChange={this.handleChange.bind(this)} value={this.state.website_name} required minLength="3" onKeyPress={this.handleKeyPress} />
            //                     <span id="error" style={errorClass}>* Special Characters not allowed</span>
            //                 </div>
            //             </div>
            //             <div className="col-md-6">
            //                 <div className="form-group">
            //                     <input type="text" className="form-control" id="exampleInputEmail2" aria-describedby="emailHelp" placeholder="Homepage Url" name="homepage_url" onChange={this.handleChange.bind(this)} value={this.state.homepage_url} required minLength="3" />
            //                 </div>
            //             </div>
            //             <div className="col-md-6">
            //                 <label> Keywords for your website</label>
            //                 <ReactTags tags={this.state.tags}
            //                     handleAddition={this.handleAddition}
            //                     delimiters={delimiters} />
            //             </div>
            //         </div>
            //         <button type="submit" className="btn-primery">Submit</button>
            //     </form>

            // </div>
        );
    }
}
export default CreateWebsite;