import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { NotificationManager } from 'react-notifications';

import {
    getWebsitesListByUserId,
    saveAlerts
} from '../../../api/commonApi';

import Alert from '../Alert/Alert';

const KeyCodes = {
    comma: 188
};
const delimiters = [KeyCodes.comma];

class CreateCustomDomain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            website: "Any Website",
            selectedWebsiteName: '',
            allWebsites: [],
            tags: [],
            suggestions: [],
            customDomain: '',
            hiddenSection: true,
            hiddenSelectedWebsite: true
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let value;
        let webArray = [];

        if (localStorage.getItem("catchLetterDetails")) {
            value = JSON.parse(localStorage.getItem("catchLetterDetails"));

            getWebsitesListByUserId(value._id).then((res) => {
                if (res.data.success == true) {
                    res.data.data.websiteList.map((res1) => {

                        const value = {
                            text: res1.website_name,
                            id: res1._id
                        };
                        webArray.push(value);
                    });
                    this.setState({
                        allWebsites: res.data.data.websiteList,
                        suggestions: webArray
                    });
                }
            }).catch((error) => {

            });
        }else{
            this.props.onHistory.push({ pathname: '/' });
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

    // update website value
    handleChangeWebsite(event) {
        if (event.target.value == "These Website") {
            this.setState({
                hiddenSelectedWebsite: false
            });
        } else if (event.target.value == "Any Website") {
            this.setState({
                hiddenSelectedWebsite: true
            });
        }
        this.setState({
            website: event.target.value
        });
    }

    handleChange(event) {
        let change = {};
        change[event.target.name] = event.target.value;
        if(event.target.value != '')
        {
            this.setState({ hiddenSection: false });
        }
        else if(event.target.value == '')
        {
            this.setState({ hiddenSection: true });
        }
        this.setState(change);
    }

    handleSubmit(event) {
        let tags = [];
        let websites = [];
        this.state.tags.map((item) => {
            tags.push({ text: item.text });
        });

        if (this.state.allWebsites.length != 0) {
            if (this.state.website == "Any Website") {
                websites = [];
                this.state.allWebsites.map((res) => {
                    const data = {
                        _id: res._id
                    };
                    websites.push(data);
                });
            } else if (this.state.website == "These Website") {
                websites = [];
                if (this.state.tags.length != 0) {
                    this.state.allWebsites.map((res) => {
                        if (res) {
                            this.state.tags.map((res1) => {
                                if (res1) {
                                    if (res.website_name == res1.text) {
                                        const data = {
                                            _id: res1.id
                                        };
                                        websites.push(data);
                                    }
                                }
                            });
                        }
                    });
                }
            }

            const valueTwo = {
                user_id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
                websites: websites
            }

            saveAlerts(valueTwo).then((result) => {
                if (result.data.success == true) {
                    // NotificationManager.success(result.data.data.message, "Success");
                    this.props.onHistory.push({ pathname: "/alerts" });
                }
            }).catch((error) => {
                NotificationManager.error("Email alerts not added.", "Error");
            });

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
                                <div className="logincontainer with-social website-edit-form">
                                    <div className="header-lined">
                                        <h2 className="website-edit-header">Add Custom Domain</h2>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="inputEmail">Custom Domain<span className="text-danger">*</span></label>
                                                <input type="text" name="customDomain" class="form-control" required onChange={this.handleChange.bind(this)} onKeyDown={this.keyPress} value={this.state.custom_domain} placeholder="Enter custom domain"/>
                                                <small hidden={this.state.hiddenSection}>We suggest you use <b>{"cl."+this.state.customDomain}</b> as your custom domain.</small>
                                            </div>
                                            <div className="form-group" hidden={this.state.hiddenSelectedWebsite}>
                                                <ReactTags
                                                    tags={this.state.tags}
                                                    suggestions={this.state.suggestions}
                                                    handleDelete={this.handleDelete.bind(this)}
                                                    handleAddition={this.handleAddition.bind(this)}
                                                    delimiters={delimiters}
                                                    placeholder="Search and select from your websites" />
                                                <small className="d-block p-1 text-muted">After search the website please click on thet website.</small>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input id="login" type="submit" className="btn btn-primary btn-sm btn-block" defaultValue={"Add "+ this.state.customDomain} hidden={this.state.hiddenSection}/><br/>&nbsp;&nbsp;&nbsp;
                                                <input id="login" type="submit" className="btn btn-success btn-sm btn-block" defaultValue={"Add cl."+ this.state.customDomain} hidden={this.state.hiddenSection} />
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

export default CreateCustomDomain;