import React, { Component } from 'react';
import { getPerticularWebsites, updateParticularWesbite } from '../../../api/commonApi';
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
class WebsiteEdit extends Component {
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
            websiteData: [],
            websiteId: ''
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


    componentDidMount() {
        window.scrollTo(0, 0);
        if (this.props.onHistory.location.websiteId) {
            localStorage.setItem("websiteId", this.props.onHistory.location.websiteId);
        }

        if (localStorage.getItem("websiteId")) {
            let websiteId = localStorage.getItem("websiteId");
            if (websiteId) {
            
                getPerticularWebsites(websiteId).then((res) => {
               
                    if (res.data.data.data.length != 0) {
                        this.setState({
                            websiteData: res.data.data.data,
                            website_name: res.data.data.data[0].website_name,
                            homepage_url: res.data.data.data[0].homepage_url
                        });

                        let arrayone = [];
                        if (res.data.data.data[0].tags.length != 0) {
                            res.data.data.data[0].tags.map((result1) => {
                                let data = {
                                    text: result1.text,
                                    id: result1.text
                                }
                                arrayone.push(data);
                            });
                            this.setState({
                                tags: arrayone
                            });
                        }
                    }
                }).catch((error) => {
                
                });
            }
        }

    }
    handleAddition(tag) {
        this.setState(state =>
            ({ tags: [...state.tags, tag] })
        );
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
                _id: localStorage.getItem("websiteId")
            };
            
            updateParticularWesbite(data).then((res) => {
               
                if (res.data.success === true) {
                    NotificationManager.success("Website updated successfully.", "Success");
                    this.props.onHistory.push({ pathname: '/list', value: "websiteInserted" });
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
            NotificationManager.error("Website name and Home Page Url are required.", "Error");
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
                                <div className="logincontainer with-social website-edit-form">
                                    <div className="header-lined">                                       
                                        <h2 className="website-edit-header">Website Edit</h2>
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
                                                <input id="login" type="submit" className="btn btn-primary btn-sm btn-block" defaultValue="Submit" />
                                            </div>
                                            <button type="button" class="btn btn-primary btn-block btn-sm" onClick={() => this.props.onHistory.push({ pathname: "/list" })}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

            </section>
        );
    }
}
export default WebsiteEdit;