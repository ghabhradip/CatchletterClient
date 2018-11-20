import React, { Component } from 'react';
import { resetPassword } from '../../../api/commonApi';

import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import qs from 'simple-query-string';

import Login from '../Login/Login';
// let IsLoggedIn = false;

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            otp: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateOtp = this.validateOtp.bind(this);

        // if (localStorage.getItem("catchLetterDetails")) {
        //     IsLoggedIn = true;
        // }
        // if (IsLoggedIn == false) {
        //     this.props.onHistory.push({ pathname: '/resetPassword/:id' });
        // }
    }

    componentDidMount() {
        // if (this.props.onHistory.location.email) {
        //     this.setState({
        //         email: this.props.onHistory.location.email
        //     });
        // }
        if (this.props && this.props.onHistory.location && this.props.onHistory.location.pathname) {
            let data = this.props.onHistory.location.pathname;
            let dataOne = data.split("/resetPassword/");
            let dataTwo = atob(dataOne[1]);
            if (dataTwo) {
                this.setState({
                    email: dataTwo
                });
            }
        }
    }

    validateOtp(e) {
        const isInteger = /^[0-9]+$/;
        if (e.target.value === '' || isInteger.test(e.target.value)) {
            this.setState({ otp: e.target.value })
        }
    }

    handleChange(event) {
        var change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
    }


    handleSubmit(event) {
        if (this.state.email) {
            const data = {
                email: this.state.email,
                password: this.state.password ? this.state.password : '',
                otp: this.state.otp ? this.state.otp : ''
            };

            resetPassword(data).then((res) => {

                if (res.data.success === true) {
                    this.props.onHistory.push({ pathname: "/" });
                }
                else {
                    NotificationManager.error("Password not reset, Try Again.", "Error");
                }
            }).catch((err) => {

                if (err.response.data.success === false) {
                    NotificationManager.error(err.response.data.data.message, "Error");
                }
            });
        }
        else {
            NotificationManager.error("Otp and Password are required.", "Error");
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
                                            <small>Enter Password</small>
                                        </p>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="inputEmail">Otp <span className="text-danger">*</span></label>
                                                <input type="text" className="form-control" placeholder="Enter Otp" autoFocus autoComplete="off" name="otp" onChange={this.validateOtp.bind(this)} value={this.state.otp} required maxLength="6" minLength="6" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputPassword">Password <span className="text-danger">*</span></label>
                                                <input type="password" name="password" className="form-control" id="inputPassword" placeholder="Password" autoComplete="off" required onChange={this.handleChange.bind(this)} value={this.state.password} />
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input id="login" type="submit" className="btn btn-primary w-50 btn-sm mb-3" defaultValue="Reset Password" />
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                {/* <label>New to CatchLetter??</label> */}
                                                <a href="javascript:void(0)" className="" onClick={() => this.props.onHistory.push({ pathname: "/" })}>Remembered your password??</a>
                                            </div>
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

export default ResetPassword;