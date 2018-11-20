import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    updateCustomer,
    changePassword,
    getCustomerById,
    uploadImage
} from '../../../api/commonApi';

import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import Home from '../Home/Home';
import Login from '../Login/Login';

import _userImage from '../../_userImage';

import { user_Image } from '../../../../redux/actions';

let IsLoggedIn = false;

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            _id: '',
            emailNew: '',
            oldPassword: '',
            newpassword: '',
            confirmPassword: '',
            imageShow: true,
            imagePreview: null
        }

        this.handleChange = this.handleChange.bind(this);
        this.validatePhone = this.validatePhone.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changePassword = this.changePassword.bind(this);

        if (localStorage.getItem("catchLetterDetails")) {
            IsLoggedIn = true;
        }
        if (IsLoggedIn == false) {
            this.props.onHistory.push({ pathname: '/' });
        }

    }

    componentDidMount() {
        if (localStorage.getItem("catchLetterDetails")) {
            let userId = JSON.parse(localStorage.getItem("catchLetterDetails"))._id;
            if (userId) {
             
                getCustomerById(userId).then((res) => {
                 
                    if (res.data.success === true) {

                        if (res.data.data.userDetails.imageFileName) {
                            this.setState({
                                imagePreview: _userImage + res.data.data.userDetails.imageFileName,
                                imageShow: false
                            });
                        } else {
                            this.setState({
                                imageShow: true,
                                imagePreview: null
                            });
                        }
                        this.setState({
                            _id: res.data.data.userDetails._id,
                            first_name: res.data.data.userDetails.first_name,
                            last_name: res.data.data.userDetails.last_name,
                            email: res.data.data.userDetails.email,
                            emailNew: res.data.data.userDetails.email
                        });
                    }
                }).catch((error) => {
                    
                    // NotificationManager.error("Please try again later.", "Error");
                });
            }
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
        if (this.state.first_name && this.state.last_name && this.state.email) {
            const data = {
                _id: this.state._id,
                first_name: this.state.first_name ? this.state.first_name : '',
                last_name: this.state.last_name ? this.state.last_name : '',
                email: this.state.email ? this.state.email : ''
            }
         
            updateCustomer(data).then((res) => {
             
                if (res.data.success === true) {
                    NotificationManager.success(res.data.data.message, "Success");
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
            NotificationManager.error("First Name, Last Name, Phone and Company are required.", "Error");
        }
        event.preventDefault();
    }

    changePassword(event) {
        if (this.state.confirmPassword && this.state.oldPassword && this.state.newPassword) {
            if (this.state.newPassword == this.state.confirmPassword) {
                const data = {
                    email: this.state.emailNew ? this.state.emailNew : '',
                    oldPassword: this.state.oldPassword ? this.state.oldPassword : '',
                    newPassword: this.state.newPassword ? this.state.newPassword : ''
                };
              
                changePassword(data).then((res) => {
                 
                    if (res.data.success === true) {
                        NotificationManager.success(res.data.data.message, "Success");
                    }
                    else {
                        NotificationManager.error("Password not changed.", "Error");
                    }
                }).catch((err) => {
                   
                    if (err.response.data.success === false) {
                        NotificationManager.error(err.response.data.data.message, "Error");
                    }
                });
            } else {
                NotificationManager.error("New and Confirm Password are not matched.", "Error");
            }
        }
        else {
            NotificationManager.error("Old, New and Confirm Password are required.", "Error");
        }
        event.preventDefault();
    }

    fileUpload = (event) => {
        let file = event.target.files['0'];
        // let fileOne = URL.createObjectURL(file);
        if (file) {

            let formData = new FormData();
            formData.append('file', file);
            formData.append('userId', JSON.parse(localStorage.getItem("catchLetterDetails"))._id);

            const config = {
                headers: { 'content-type': 'multipart/form-data' }
            }

            uploadImage(formData, config).then((res) => {
                if (res.data.success == true) {
                    setTimeout(() => {
                        let toChangeData = JSON.parse(localStorage.getItem("catchLetterDetails"));
                        toChangeData.imageFileName = res.data.data.filename;
                        localStorage.setItem("catchLetterDetails", JSON.stringify(toChangeData));
                        this.props.user_Image(res.data.data.filename);
                        this.setState({
                            imagePreview: _userImage + res.data.data.filename,
                            imageShow: false
                        });
                    }, 100);
                }
            }).catch((error) => {
                this.setState({
                    imageShow: true,
                    imagePreview: null
                });
                NotificationManager.error("Image upload failed.", "Error");
            });
        }
    }

    render() {
        return (
            <section className="edit-account-list py-5">
                <div className="account-table">
                    <div className="container">
                        <div className="card shadow-sm main-frm">
                            <div className="account-form">
                                <form className="frm" onSubmit={this.handleSubmit}>
                                    <div className="f-heading mb-4">
                                        <h2 className="text-uppercase">Your information</h2>
                                    </div>
                                    <div className="form-group col-md-3 m-auto position-relative">
                                        <div className="upload-image">
                                            <img id="output" className="rounded-circle" width="140px" height="150px" src={this.state.imagePreview} hidden={this.state.imageShow} />
                                            <input type="file" name="profileimage" onChange={this.fileUpload.bind(this)} />
                                            <i className="fa fa-edit"></i>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input type="text" className="form-control" placeholder="First Name" autoComplete="off" name="first_name" onChange={this.handleChange.bind(this)} value={this.state.first_name} minLength="3" />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input type="text" className="form-control" placeholder="Last Name" autoComplete="off" name="last_name" onChange={this.handleChange.bind(this)} value={this.state.last_name} />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" name="email" className="form-control" id="inputEmail" placeholder="Enter email" onChange={this.handleChange.bind(this)} value={this.state.email} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="submit" className="btn btn-primary text-uppercase rounded-0" defaultValue="Update your information" />
                                    </div>
                                </form>

                                <form onSubmit={this.changePassword}>
                                    <div className="f-heading my-4">
                                        <h2 className="text-uppercase">Change Password</h2>
                                    </div>
                                    {/* <div className="form-group">
                                        <label>Email *</label>
                                        <input type="email" name="emailNew" className="form-control" id="inputEmail" placeholder="Enter email" required onChange={this.handleChange.bind(this)} value={this.state.emailNew} />
                                    </div> */}
                                    <div className="form-group">
                                        <label>Old Password <span className="text-danger">*</span></label>
                                        <input type="password" name="oldPassword" className="form-control" id="inputPassword" placeholder="Old Password" autoComplete="off" required onChange={this.handleChange.bind(this)} value={this.state.oldPassword} minLength="6" />
                                    </div>
                                    <div className="form-group">
                                        <label>New Password <span className="text-danger">*</span></label>
                                        <input type="password" name="newPassword" className="form-control" id="inputPasswordOne" placeholder="New Password" autoComplete="off" required onChange={this.handleChange.bind(this)} value={this.state.newPassword} minLength="6" />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm Password <span className="text-danger">*</span></label>
                                        <input type="password" name="confirmPassword" className="form-control" id="inputPasswordOne" placeholder="Confirm Password" autoComplete="off" required onChange={this.handleChange.bind(this)} value={this.state.confirmPassword} minLength="6" />
                                    </div>
                                    <div className="form-group">
                                        <input type="submit" className="btn btn-primary text-uppercase rounded-0" defaultValue="Update your Password" />
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
        userData: state.userImage
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ user_Image }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);