import React, { Component } from 'react';
import { sendOtp } from '../../../api/commonApi';

import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import ResetPassword from '../ResetPassword/ResetPassword';
import Login from '../Login/Login';

let IsLoggedIn = false;

class Otp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


        if (localStorage.getItem("catchLetterDetails")) {
            IsLoggedIn = true;
        }
        if (IsLoggedIn == false) {
            // this.props.onHistory.push({ pathname: '/' });
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
                email: this.state.email ? this.state.email : ''
            };

            sendOtp(data).then((res) => {

                if (res.status === 200) {
                    // this.props.onHistory.push({ pathname: "/resetPassword", email: this.state.email });
                    this.props.onHistory.push({ pathname: "/resetPassword/" + btoa(this.state.email) });
                }
                else {
                    NotificationManager.error("Otp no send.", "Error");
                }
            }).catch((err) => {

                if (err.response.data.success === false) {
                    NotificationManager.error(err.response.data.data.message, "Error");
                }
            });
        }
        else {
            NotificationManager.error("Email is required.", "Error");
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
                                            <small>Forgot Password</small>
                                        </p>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="inputEmail">Email Address <span className="text-danger">*</span></label>
                                                <input type="email" name="email" className="form-control" id="inputEmail" placeholder="Enter email" required autoFocus onChange={this.handleChange.bind(this)} value={this.state.email} />
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input id="login" type="submit" className="btn btn-primary w-50 btn-sm mb-3" defaultValue="Sent Otp" />
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

export default Otp;