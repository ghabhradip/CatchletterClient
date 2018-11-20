import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { NotificationManager } from 'react-notifications';

import {
    getWebsitesListByUserId
} from '../../../api/commonApi';

const KeyCodes = {
    comma: 188
};
const delimiters = [KeyCodes.comma];

class EditAlert extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totalData: [],
            allWebsites: [],
            tags: [],
            suggestions: [],
            hiddenSelectedWebsite: true
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let dataArray = [];
        let valueThree;
        let webArray = [];

        if (this.props.onHistory.location && this.props.onHistory.location.value) {
            localStorage.setItem("EmailAlertDetails", JSON.stringify(this.props.onHistory.location.value));
        }

        if (localStorage.getItem("catchLetterDetails")) {
            valueThree = JSON.parse(localStorage.getItem("catchLetterDetails"));
        }

        if (localStorage.getItem("EmailAlertDetails")) {
            let value = JSON.parse(localStorage.getItem("EmailAlertDetails"));
            dataArray.push(value);
            if (dataArray.length != 0) {
                this.setState({
                    totalData: dataArray
                });
            }
        }

        getWebsitesListByUserId(valueThree._id).then((res) => {
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

    handleSubmit() {

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
                                        <h2 className="website-edit-header">Edit email Alerts</h2>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="inputEmail">When<span className="text-danger">*</span></label>
                                                <select className="form-control" onChange={this.handleChangeWebsite.bind(this)} >
                                                    <option value="Any Website">Any Website</option>
                                                    <option value="These Website">These Websites</option>
                                                </select>

                                                <div className="form-group" hidden={this.state.hiddenSelectedWebsite}>
                                                    <ReactTags
                                                        tags={this.state.tags}
                                                        suggestions={this.state.suggestions}
                                                        handleDelete={this.handleDelete.bind(this)}
                                                        handleAddition={this.handleAddition.bind(this)}
                                                        delimiters={delimiters} />
                                                    <small className="d-block p-1 text-muted">After search the website please click on thet website.</small>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <input id="login" type="submit" className="btn btn-primary btn-sm btn-block" defaultValue="Submit" />
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

export default EditAlert;