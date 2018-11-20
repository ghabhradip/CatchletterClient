import React, { Component } from 'react';
import { customerSignup, billingResult } from '../../../api/commonApi';

import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { user_SignUp } from '../../../../redux/actions';
import Login from '../Login/Login';

let IsLoggedIn = false;

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            phone: '',
            company: ''
        };
        this.handleChange = this.handleChange.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.validatePhone = this.validatePhone.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        if (localStorage.getItem("catchLetterDetails")) {
            IsLoggedIn = true;
        }
        if (IsLoggedIn == false) {
            // this.props.onHistory.push({ pathname: '/' });
        }
    }

    /** save value to state */
    handleChange(event) {
        var change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
    }

    validatePhone(e) {
        const isInteger = /^[0-9]+$/;
        if (e.target.value === '' || isInteger.test(e.target.value)) {
            this.setState({ phone: e.target.value })
        }
    }

    /** sign up  */
    handleSubmit(event) {
        if (this.state.first_name && this.state.last_name && this.state.phone && this.state.email && this.state.password && this.state.company) {
           
            const data = {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                phone: this.state.phone,
                email: this.state.email,
                password: this.state.password,
                company: this.state.company,
                imageFileName: ''
            };
            customerSignup(data).then((res) => {
                
                if (res.data.success === true) {

                    let expiryDate = new Date(new Date().setDate(new Date().getDate() + parseInt("14")));

                    // initial billing plan
                    const billingData = {
                        account_id: "",
                        account_name: "",
                        country: "",
                        zipCode: "",
                        email: this.state.email,
                        firstName: this.state.first_name,
                        lastName: this.state.last_name,
                        id: "",
                        amount: "0",
                        planType: "Plan Zero",
                        currencyType: "",
                        order_id: "1",
                        payment_processor: "",
                        thrivecart_hash: "",
                        userId: res.data.data.details[0]._id,
                        billingDate: new Date(),
                        expiryDate: expiryDate
                    };

                    billingResult(billingData).then((billingRes) => {
                        if (billingRes.data.success == true) {
                            // localStorage.setItem("catchLetterDetails", JSON.stringify(res.data.data.details[0]))
                            // NotificationManager.success(res.data.data.message, "Success");
                            // this.props.user_SignUp(res.data.data.details[0]);
                            // this.props.onHistory.push({ pathname: "/home" });
                            NotificationManager.success("Please activate your account from your mail to conitinue.", "Success");
                            this.props.onHistory.push({ pathname: "/" });
                        }
                    }).catch((error) => {
                       
                    });
                }
                else {
                    NotificationManager.error(res.data.data.message, "Error");
                }
            }).catch((err) => {
                
                if (err.response.data.success === false) {
                    NotificationManager.error(err.response.data.data.message, "Error");
                }
            });
        }
        else {
            NotificationManager.error("First Name, Email, Password, Phone and Company are required.", "Error");
        }
        event.preventDefault();
    }

    render() {
        return (
            <section id="main-body" className="d-flex justify-content-center align-items-center">

                <div className="container">
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="col-12 main-content">
                                <div className="logincontainer with-social">
                                    <div className="text-center lgo">
                                        <a href="index.html">
                                            <img src={require('../../../../assets/images/logo.png')} alt="logo" className="img-fluid" />
                                        </a>
                                    </div>
                                    <div className="header-lined">
                                        <p>
                                            <small>please Sign up to access</small>
                                        </p>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label>First Name <span className="text-danger">*</span></label>
                                                <input type="text" className="form-control" placeholder="First Name" autoComplete="off" name="first_name" autoFocus onChange={this.handleChange.bind(this)} value={this.state.first_name} required minLength="3" />
                                            </div>
                                            <div className="form-group">
                                                <label>Last Name <span className="text-danger">*</span></label>
                                                <input type="text" className="form-control" placeholder="Last Name" autoComplete="off" name="last_name" onChange={this.handleChange.bind(this)} required value={this.state.last_name} />
                                            </div>
                                            <div className="form-group">
                                                <label>Email <span className="text-danger">*</span></label>
                                                <input type="email" className="form-control" placeholder="Your Email" autoComplete="off" name="email" onChange={this.handleChange.bind(this)} value={this.state.email} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Password <span className="text-danger">*</span></label>
                                                <input type="password" className="form-control" placeholder="Password" autoComplete="off" name="password" onChange={this.handleChange.bind(this)} value={this.state.password} required minLength="6" />
                                            </div>
                                            <div className="form-group">
                                                <label>Phone Number <span className="text-danger">*</span></label>
                                                <input type="text" className="form-control" placeholder="Phone Number" autoComplete="off" name="phone" onChange={this.validatePhone.bind(this)} value={this.state.phone} required maxLength="10" minLength="10" />
                                            </div>
                                            <div className="form-group">
                                                <label>Company <span className="text-danger">*</span></label>
                                                <input type="text" className="form-control" placeholder="Company" autoComplete="off" name="company" onChange={this.handleChange.bind(this)} value={this.state.company} required minLength="3" />
                                            </div>
                                            {/* <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" name="rememberme" data-parsley-multiple="rememberme" /> Remember Me
                                            </label>
                                            </div> */}
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input id="login" type="submit" className="btn btn-primary w-50 btn-sm mb-3" defaultValue="SignUp" />
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <label>Already a member??  <a href="javascript:void(0)" className="" onClick={() => this.props.onHistory.push({ pathname: "/" })}>Login</a></label>

                                            </div>
                                            {/* </form> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        userData: state.userAuth
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ user_SignUp }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);