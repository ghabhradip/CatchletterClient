import React, { Component } from 'react';

import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import {
    setPasswordForNewUser
} from '../../../api/commonApi';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showHeader } from '../../../../redux/actions';

class SetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            otp: '',
            password: '',
            confirmPassword: '',
            email: ''
        };
    }

    validateOtp(e) {
        const isInteger = /^[0-9]+$/;
        if (e.target.value === '' || isInteger.test(e.target.value)) {
            this.setState({ otp: e.target.value })
        }
    }

    componentDidMount() {
        localStorage.removeItem("catchLetterDetails");
        this.props.showHeader(false);

        if (!localStorage.getItem("newSubscription")) {
            this.props.onHistory.push({ pathname: '/' });
        }
        else{
        	this.setState({
        	email: localStorage.getItem("newSubscription")
        	})
        }
    }

    /** save value to state */
    handleChange(event) {
        var change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
    }

    handleSubmit(event) {
        if (this.state.otp && this.state.password && this.state.confirmPassword) {
            if (this.state.password != this.state.confirmPassword) {

                NotificationManager.error("Passwords do not match.", "Error");
            } else {

                if (localStorage.getItem("newSubscription")) {
                
                    const data = {
                        otp: this.state.otp,
                        password: this.state.password,
                        email: localStorage.getItem("newSubscription")
                    };
                    setPasswordForNewUser(data).then((res) => {
                     
                        if (res.data.success === true) {
                            localStorage.removeItem("newSubscription");
                            this.props.onHistory.push({
                                pathname: "/"
                            });
                        } else {
                            NotificationManager.error("Password not reset, Try Again.", "Error");
                        }
                    }).catch((err) => {
                      
                        if (err.response.data.data.message) {
                            NotificationManager.error(err.response.data.data.message, "Error");
                        }
                        else {
                            NotificationManager.error("Please try again later.", "Error");
                        }
                    });
                }
            }
        } else {
            NotificationManager.error("Otp, password and confirm password are required.", "Error");
        }
        event.preventDefault();
    }

    render() {
        return (
            <section className="edit-account-list py-5">
                <div className="account-table">
                    <div className="container">
                        <div className="card shadow-sm main-frm">
                            <div className="account-form">
                                <form className="frm" onSubmit={this.handleSubmit.bind(this)}>
                                    <div className="f-heading mb-4">
                                        <h2 className="text-uppercase">We've sent you a One Time Passcode</h2>
                                        <p>Please check your email <b>{this.state.email}</b> and come back here to enter the OTP</p>
                                    </div>
                                    <div className="form-group">
                                        <label>OTP<span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" placeholder="Enter your OTP here" autoComplete="off" name="otp" onChange={this.validateOtp.bind(this)} value={this.state.otp} maxLength="6" minLength="6" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Password<span className="text-danger">*</span></label>
                                        <input type="password" className="form-control" placeholder="Enter a password you'd like to use for logging in to CatchLetter" name="password" onChange={this.handleChange.bind(this)} value={this.state.password} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm Password<span className="text-danger">*</span></label>
                                        <input type="password" className="form-control" placeholder="Enter the same password as above" name="confirmPassword" onChange={this.handleChange.bind(this)} value={this.state.confirmPassword} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="submit" className="btn btn-primary text-uppercase rounded-0" defaultValue="Create Password and Login to Dashboard" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        )
    }
}

function mapStateToProps(state) {
    return {
        showHeader: state.showHeader
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ showHeader }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SetPassword);
