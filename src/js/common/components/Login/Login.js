import React, { PureComponent } from 'react';
import { customerLogin } from '../../../api/commonApi';

import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { user_Login, showHeader } from '../../../../redux/actions';

import Otp from '../Otp/Otp';
import cookie from 'react-cookies'

let IsLoggedIn = false;

class Login extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            rememberme: false
        }

        if (localStorage.getItem("catchLetterDetails")) {
            IsLoggedIn = true;
            if (IsLoggedIn == true) {
                this.props.onHistory.push({ pathname: "/home" });
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkboxValueSet = this.checkboxValueSet.bind(this);
    }

    componentWillMount() {

        let email_password = cookie.load('email_password');
        if (email_password) {
            this.setState({
                rememberme: true,
                email: email_password.email,
                password: email_password.password
            });
        }
    }

    checkboxValueSet() {
        this.setState({
            rememberme: !this.state.rememberme
        });
    }

    handleChange(event) {
        var change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
    }


    handleSubmit(event) {
        if (this.state.email && this.state.password) {
            if (this.state.rememberme == false) {
                const data = {
                    email: this.state.email ? this.state.email : '',
                    password: this.state.password ? this.state.password : ''
                };

                customerLogin(data).then((res) => {

                    if (res.data.success === true) {
                        localStorage.setItem("catchLetterDetails", JSON.stringify(res.data.data.userDetails));
                        cookie.remove('email_password', data);
                        this.props.user_Login(res.data.data.userDetails);
                        this.props.showHeader(true);
                        this.props.onHistory.push({ pathname: "/home" });
                    }
                    else if (res.data.success === false) {
                        NotificationManager.error("Email and password does not match", "Error");
                    }
                }).catch((err) => {

                    if (err.response.data.success === false) {
                        NotificationManager.error(err.response.data.data.message, "Error");
                    }
                });

            } else if (this.state.rememberme == true) {
                const data = {
                    email: this.state.email ? this.state.email : '',
                    password: this.state.password ? this.state.password : ''
                };

                customerLogin(data).then((res) => {

                    if (res.data.success === true) {
                        localStorage.setItem("catchLetterDetails", JSON.stringify(res.data.data.userDetails));
                        cookie.save('email_password', data, {
                            expires: new Date(Date.now() + 864000)
                        });
                        NotificationManager.success("Successfully logged in.", "Success");
                        this.props.user_Login(res.data.data.userDetails);
                        this.props.showHeader(true);
                        this.props.onHistory.push({ pathname: "/home" });
                    }
                    else if (res.data.success === false) {
                        NotificationManager.error("Email and password does not match", "Error");
                    }
                }).catch((err) => {

                    if (err.response.data.success === false) {
                        NotificationManager.error(err.response.data.data.message, "Error");
                    }
                });
            }

        }
        else {
            NotificationManager.error("Email and password are required.", "Error");
        }
        event.preventDefault();
    }

    render() {
        return (
            // <section id="main-body" className="d-flex justify-content-center align-items-center">

            //     <div className="container">
            //         <form onSubmit={this.handleSubmit}>
            //             <div className="row">
            //                 <div className="col-12 main-content">
            //                     <div className="logincontainer with-social">
            //                         <div className="text-center lgo">
            //                             <a href="index.html">
            //                                 <img src={require('../../../../assets/images/logo.png')} alt="logo" className="img-fluid" />
            //                             </a>
            //                         </div>
            //                         <div className="header-lined">
            //                             <p>
            //                                 <small>please login to access</small>
            //                             </p>
            //                         </div>
            //                         <div className="row">
            //                             <div className="col-12">
            //                                 {/* <form className="login-form" role="form" > */}
            //                                 <div className="form-group">
            //                                     <label htmlFor="inputEmail">Email Address <span className="text-danger">*</span></label>
            //                                     <input type="email" name="email" className="form-control" id="inputEmail" placeholder="Enter email" required autoFocus onChange={this.handleChange.bind(this)} value={this.state.email} />
            //                                 </div>
            //                                 <div className="form-group">
            //                                     <label htmlFor="inputPassword">Password <span className="text-danger">*</span></label>
            //                                     <input type="password" name="password" className="form-control" id="inputPassword" placeholder="Password" autoComplete="off" required onChange={this.handleChange.bind(this)} value={this.state.password} />
            //                                 </div>
            //                                 <div className="checkbox">
            //                                     <label>
            //                                         <input type="checkbox" name="rememberme" checked={this.state.rememberme} data-parsley-multiple="rememberme" onChange={this.checkboxValueSet.bind(this)} /> Remember Me
            //                                     </label>
            //                                 </div>
            //                                 <div className="d-flex align-items-center justify-content-center mb-3 justify-content-between">
            //                                     <input id="login" type="submit" className="btn btn-primary w-50 btn-sm mb-0" defaultValue="Login" />
            //                                     <a href="javascript:void(0)" onClick={() => this.props.onHistory.push({ pathname: "/otp" })} className="d-inline">Forgot Password?</a>
            //                                 </div>
            //                                 <div className="d-flex align-items-center justify-content-center">
            //                                     <label>New to CatchLetter??  <a href="javascript:void(0)" className="" onClick={() => this.props.onHistory.push({ pathname: "/signup" })}>Sign Up</a></label>

            //                                 </div>
            //                             </div>
            //                         </div>
            //                     </div>
            //                 </div>
            //             </div>
            //         </form>
            //     </div>

            // </section>


            <section id="sigin-in" className="py-3">
                <div className="container">
                    <div className="row singin-all justify-content-center align-items-center">
                        <div className="col-lg-10 m-auto">
                            <div className="row m-auto">
                                <div className="col-lg-6 col-12 col-md-6 p-r pr-0">
                                    <div className="sigin-form padd-sig">
                                        <a href="javascript:void(0)"><img src={require('../../../../assets/images/black-logo.png')} alt="black-logo" className="img-fluid" /></a>
                                        <p>Welcome! Please login to your account
                                            </p>
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="all-input">
                                                <div className="input-box">
                                                    <input className="mail" type="email" name="email" required onChange={this.handleChange.bind(this)} value={this.state.email} placeholder="EMAIL ADDRESS" />
                                                </div>
                                                <div className="pass-box">
                                                    <input className="pass" type="password" name="password" required onChange={this.handleChange.bind(this)} value={this.state.password} placeholder="PASSWORD" />
                                                </div>
                                            </div>
                                            <label className="text-left">
                                                <input className="check-box" type="checkbox" name="rememberme" checked={this.state.rememberme} onChange={this.checkboxValueSet.bind(this)} /><span>Remember me</span>
                                            </label>
                                            <a className="forgot" href="javascript:void(0)" onClick={() => this.props.onHistory.push({ pathname: "/otp" })}>Forgot Password?</a>
                                            <div className="login">
                                                <input id="login" type="submit" className="login-btn" defaultValue="Login" />
                                                {/* <a href="javascript:void(0)">Log In</a> */}
                                            </div>
                                        </form>
                                        <p>New to CatchLetter?? <a href="javascript:void(0)" onClick={() => this.props.onHistory.push({ pathname: "/signup" })}><span>Sign Up</span></a></p>
                                    </div>
                                </div>
                                <div className="col-lg-6 p-l col-md-6 pl-0">
                                    <div className="sigin-text padd-text">
                                        <div className="client-pic text-center">
                                            <img src={require('../../../../assets/images/client1.png')} alt="client1" />
                                        </div>
                                        <p>Saves you the trouble of filing and cataloguing email swipes of your competitors in your own inbox. Use it all for inspiration, CTAs, newsletters, and offers. Save your money and time with copywriters.</p>
                                        <h3>David Nguyen - Web Freaks Media</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

function mapStateToProps(state) {
    return {
        userData: state.userAuth
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ user_Login, showHeader }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
