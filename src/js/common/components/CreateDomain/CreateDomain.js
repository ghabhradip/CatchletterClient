import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { createDomain } from '../../../api/commonApi';

class CreateDomain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            domainName: "",
            userId: ""
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        if (localStorage.getItem("catchLetterDetails")) {
            const userData = JSON.parse(localStorage.getItem("catchLetterDetails"));
            this.setState({
                userId: userData._id
            });
        }
    }


    handleChange(event) {
        var change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
    }

    handleSubmit(event) {
        if (this.state.domainName) {
            let emailDomain = this.state.domainName.replace(/ +/g, "");
            const data = {
                domainName: emailDomain,
                user_id: this.state.userId
            }
            createDomain(data).then((res) => {
                if (res.data.success == true) {
                    NotificationManager.success("Domain created successfully.", "Success");
                    this.props.onHistory.push({ pathname: "/" });
                }
            }).catch((err) => {
                NotificationManager.error(err.response.data.data.message, "Error");
            });

        } else {
            NotificationManager.error("Domain is required.", "Error");
        }
        event.preventDefault();
    }

    render() {
        return (
            <section id="main-body" className="d-flex justify-content-center align-items-center">
                <div className="container">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="row">
                            <div className="col-12 main-content">
                                <div className="logincontainer with-social">
                                    <div className="text-center lgo">
                                        <a href="index.html">
                                            <img src={require('../../../../assets/images/beta.jpg')} alt="logo" className="img-fluid" />
                                        </a>
                                    </div>
                                    <div className="header-lined">
                                        <p>
                                            <small>Create Domain</small>
                                        </p>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="inputEmail">Domain Name <span className="text-danger">*</span></label>
                                                <input type="text" name="domainName" className="form-control" id="inputEmail" placeholder="Domain Name" required autoFocus onChange={this.handleChange.bind(this)} value={this.state.domainName} />
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
        )
    }
}

export default CreateDomain;