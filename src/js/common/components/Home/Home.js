import React, { Component } from 'react';
import { Line } from 'react-chartjs';
import {
    getListOfMailsByWebsite,
    getListOfMailsByUserId1,
    getWebsitesListByUserId,
    getListOfMailsByUserIdWithPagination,
    getWebsiteTags,
    markMailAsFavourite,
    removeMailAsFavouriteId,
    getwebsitebydatecheck,
    getBillingData
} from '../../../api/commonApi';
import {
    NotificationManager
} from 'react-notifications';
import Pagination from "react-js-pagination";
import Login from '../Login/Login';
import EmailDetails from '../EmailDetails/EmailDetails';
import BillingExpire from '../BillingExpire/BillingExpire';
import {
    DateRange
} from 'react-date-range';
import _imageURL from '../../_imageURL';
import moment from 'moment';

let IsLoggedIn = false;

// let labelsArray = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
// let datasArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 38, 37];

// let data = {
//     labels: labelsArray,
//     datasets: [{
//         label: "My First dataset",
//         fillColor: "rgba(220,220,220,0.2)",
//         strokeColor: "#007bff",
//         pointColor: "#007bff",
//         pointStrokeColor: "#fff",
//         pointHighlightFill: "#fff",
//         pointHighlightStroke: "#007bff",
//         data: datasArray
//     }]
// };

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            monthlyLineData: '',
            allWebsitesData: '',
            websiteList: [],
            totalMonthLineData: '',
            totalAllWebsitesData: '',
            selectedWesbite: '',
            totalMailCount: 0,
            sevenDaysMailCount: 0,
            thirtyDaysMailCount: 0,
            todaysMailCount: 0,
            IsShowDatePicker: false,
            sDate: '',
            eDate: '',
            date: '',
            website_name: '',
            allWebsite: [],
            Tags: [],
            favoutiteEmails: [],
            tags: '',
            inputText: '',
            selectedEmailDomain: '',
            selectedUniqueId: '',
            totalItemsData: [],
            totalItemsCount: 0,
            initialTotalItemCount: '',
            hiddenTotalGraph: false,
            hiddenPerticularGraph: true,
            expireMessage: '',
            hideButtonDate: true
        }

        if (localStorage.getItem("catchLetterDetails")) {
            IsLoggedIn = true;
        }

        if (IsLoggedIn == false) {
            this.props.onHistory.push({ pathname: '/' });
        }

    }

    handleDate() {
        this.setState({
            IsShowDatePicker: true,
            date: '',
            hideButtonDate: false
        })
    }


    handlePageChange(pageNumber) {
        let requestBody = {};
        this.setState({
            pageNumber: pageNumber
        });

        if (localStorage.getItem("catchLetterDetails")) {
            let value = JSON.parse(localStorage.getItem("catchLetterDetails"));
            requestBody.id = value._id;
        }

        if (this.state.inputText) {
            requestBody.subject = this.state.inputText;
        }
        if (this.state.selectedEmailDomain) {
            requestBody.emailDomain = this.state.selectedEmailDomain;
            requestBody.unique_id = this.state.selectedUniqueId;
        }
        if (this.state.sDate && this.state.eDate) {
            requestBody.fromDate = this.state.sDate;
            requestBody.toDate = this.state.eDate;
        }
        if (this.state.tags) {
            requestBody.tags = this.state.tags;
        }
        requestBody.page = pageNumber;

        getListOfMailsByUserIdWithPagination(requestBody).then((res) => {
            if (res.data.success == true) {
                for (let i = 0; i < res.data.data.message.length; i++) {

                    res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                }

                this.setState({
                    favoutiteEmails: res.data.data.message
                });
                this.setState({
                    isLength: true
                });
            } else {
                this.setState({
                    favoutiteEmails: []
                });
            }
        }).catch((err) => {
            this.setState({
                favoutiteEmails: []
            });
            NotificationManager.error(err.response.data.data, "Error");
        });
    }

    handleTagsChange(event) {
        var change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
        let requestBody = {};
        this.setState({
            isLength: false
        });
        if (event.target.name == "tags") {
            let value = JSON.parse(localStorage.getItem("catchLetterDetails"));

            requestBody.id = value._id;
            if (this.state.inputText) {
                requestBody.subject = this.state.inputText;
            }
            if (this.state.selectedEmailDomain) {
                requestBody.emailDomain = this.state.selectedEmailDomain;
                requestBody.unique_id = this.state.selectedUniqueId;
            }
            if (this.state.sDate && this.state.eDate) {
                requestBody.fromDate = this.state.sDate;
                requestBody.toDate = this.state.eDate;
            }
            if (event.target.value == "alltags") {

            } else {
                requestBody.tags = event.target.value;
            }

            getListOfMailsByUserIdWithPagination(requestBody).then((res) => {
                this.setState({
                    isLength: true
                });
                if (res.data.success == true) {
                    for (let i = 0; i < res.data.data.message.length; i++) {
                        res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                    }
                    this.setState({
                        favoutiteEmails: res.data.data.message,
                        totalItemsCount: res.data.data.totalCount
                    });


                    // if (res.data.data.message1.length != 0) {
                    //     this.getLastSevennDaysMail(res.data.data.message1);
                    //     let filterDataArray = res.data.data.message1;
                    //     let totalData = [];
                    //     filterDataArray.map((item) => {
                    //         let data = { month: this.getMonthName(item.header.date[0]), data: [item] };
                    //         totalData.push(data);
                    //     });
                    //     //check which months are present
                    //     totalData = this.checkIfMonthExists(totalData);
                    //     var finalList = totalData;
                    //     var services = {};
                    //     for (var i = 0; i < finalList.length; i++) {
                    //         var serviceId = finalList[i].month;
                    //         if (!services[serviceId]) {
                    //             services[serviceId] = [];
                    //         }
                    //         services[serviceId].push(finalList[i]);
                    //     }
                    //     finalList = [];
                    //     for (var groupName in services) {
                    //         finalList.push({ group: groupName, color: services[groupName] });
                    //     }
                    //     let datasArray = [];
                    //     let labelsArray = [];
                    //     for (let key in finalList) {
                    //         if (finalList[key].color[0].month) {
                    //             // let data = { "serviceName": finalList[key].color[0].month, totalCount:finalList[key].color.length  };
                    //             datasArray.push(finalList[key].color[0].data.length);
                    //             labelsArray.push(finalList[key].color[0].month);
                    //         }
                    //     }
                    //     let data = {
                    //         labels: labelsArray,
                    //         datasets: [{
                    //             label: "My First dataset",
                    //             fillColor: "rgba(220,220,220,0.2)",
                    //             strokeColor: "#007bff",
                    //             pointColor: "#007bff",
                    //             pointStrokeColor: "#fff",
                    //             pointHighlightFill: "#fff",
                    //             pointHighlightStroke: "#007bff",
                    //             data: datasArray
                    //         }]
                    //     };
                    //     this.setState({
                    //         monthlyLineData: data,
                    //         totalMonthLineData: data,
                    //         totalMailCount: res.data.data.message1.length
                    //     });
                    // } else if (res.data.data.message1.length == 0) {
                    //     let dataFour = [];
                    //     this.getLastSevennDaysMail(dataFour);

                    //     let totalData = [];
                    //     totalData = this.checkIfMonthExists(totalData);
                    //     var finalList = totalData;
                    //     var services = {};
                    //     for (var i = 0; i < finalList.length; i++) {
                    //         var serviceId = finalList[i].month;
                    //         if (!services[serviceId]) {
                    //             services[serviceId] = [];
                    //         }
                    //         services[serviceId].push(finalList[i]);
                    //     }
                    //     finalList = [];
                    //     for (var groupName in services) {
                    //         finalList.push({ group: groupName, color: services[groupName] });

                    //     }
                    //     let datasArray = [];
                    //     let labelsArray = [];
                    //     for (let key in finalList) {
                    //         if (finalList[key].color[0].month) {
                    //             // let data = { "serviceName": finalList[key].color[0].month, totalCount:finalList[key].color.length  };
                    //             datasArray.push(finalList[key].color[0].data.length);
                    //             labelsArray.push(finalList[key].color[0].month);
                    //         }
                    //     }
                    //     let data = {
                    //         labels: labelsArray,
                    //         datasets: [{
                    //             label: "My First dataset",
                    //             fillColor: "rgba(220,220,220,0.2)",
                    //             strokeColor: "#007bff",
                    //             pointColor: "#007bff",
                    //             pointStrokeColor: "#fff",
                    //             pointHighlightFill: "#fff",
                    //             pointHighlightStroke: "#007bff",
                    //             data: datasArray
                    //         }]
                    //     };
                    //     this.setState({
                    //         monthlyLineData: data,
                    //         totalMonthLineData: data,
                    //         totalMailCount: 0
                    //     });
                    // }


                } else {

                    this.setState({
                        favoutiteEmails: [],
                        isLength: true
                    });
                }

            }).catch((Err) => {

                this.setState({
                    isLength: true,
                    favoutiteEmails: []
                });
            });

        }
    }


    renderFavouriteEmails() {
        if (this.state.favoutiteEmails.length != 0) {
            return this.state.favoutiteEmails.map((res, index) => (
                <div className="col-12 col-md-6 col-lg-3" key={index}>
                    <div className="card shadow">
                        {
                            res.header && res.header.date && res.header.from && res.header.subject && res.header.to ?
                                <div className="card-header">
                                    <h2><a href="javascript:void(0)" onClick={() => this.showMail(res.emailDomain, res.unique_id, res.uid, res._id)}>{res.header.subject[0]}</a></h2>
                                    <p><span>from: </span> <a href="javascript:void(0)" onClick={() => this.showMail(res.emailDomain, res.unique_id, res.uid, res._id)}>{(res.header.from[0]).split("<")[0]}</a></p>
                                    {/* <p><span>to: </span> <a href="javascript:void(0)">{res.header.to[0]}</a></p> */}
                                    <p><span>Sent: </span> <a href="javascript:void(0)">{res.header.date[0].split(" ")[0] + " " + res.header.date[0].split(" ")[1] + " " + res.header.date[0].split(" ")[2] + " " + res.header.date[0].split(" ")[3] + " " + res.header.date[0].split(" ")[4]}</a></p>
                                    {
                                        res && res.flag == 0 ?
                                            <a href="javascript:void(0)" className="star-ml">
                                                <i className="fa fa-star-o" onClick={() => this.markMailAsFavourite(res.emailDomain, res.unique_id, res.uid, res.seqno)} />
                                            </a>
                                            :
                                            <a href="javascript:void(0)" className="star-ml">
                                                <i className="fa fa-star" onClick={() => this.removeMailAsFavourite(res.emailDomain, res.unique_id, res.uid, res.seqno)} />
                                            </a>
                                    }
                                </div>
                                :
                                <div>Header not specified.</div>
                        }

                        <div className="card-body" >
                            <figure style={{ height: 150, overflow: 'hidden' }}>
                                {/* {ReactHtmlParser(res.htmlData)} */}
                                <img src={res.imageUrl} style={{ width: '100%' }} />
                            </figure>
                        </div>
                        <div className="card-footer clearfix">
                            <a href="javascript:void(0)" className="text-primary float-right" onClick={() => this.showMail(res.emailDomain, res.unique_id, res.uid, res._id)}> View Email </a>
                        </div>
                    </div>
                </div>
            ));
        }
        else if (this.state.isLength == false) {
            return <div className="p-4"><h3>Loading...</h3></div>
        }
        else {
            return (
                <div className="no-image">
                    <img src={require('../../../../assets/images/star-image.png')} className="img-fluid mb-3" />
                    <h2 className="mb-3">No emails yet!</h2>
                </div>
            )
        }
    }

    markMailAsFavourite(emailDomain, unique_id, value, seqno) {
        const data = {
            emailDomain: emailDomain,
            unique_id: unique_id,
            id: JSON.stringify(value),
            user_id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
            seqno: JSON.stringify(value)
        };
        let myFavEmails = this.state.favoutiteEmails;
        for (let i = 0; i < myFavEmails.length; i++) {
            if (myFavEmails[i].uid == value && myFavEmails[i].emailDomain == emailDomain) {
                myFavEmails[i].flag = 1;
                break;
            }
        }
        this.setState({ favoutiteEmails: myFavEmails });

        markMailAsFavourite(data).then((res) => {

            if (res.data.success == true) {

            } else {
                NotificationManager.error("Please try again later.", "Error");
            }
        }).catch((error) => {

            NotificationManager.error("Please try again later.", "Error");
        });
    }

    removeMailAsFavourite(emailDomain, unique_id, value, seqno) {
        const data = {
            emailDomain: emailDomain,
            unique_id: unique_id,
            id: JSON.stringify(value),
            seqno: JSON.stringify(value)
        };
        let myFavEmails = this.state.favoutiteEmails;
        for (let i = 0; i < myFavEmails.length; i++) {
            if (myFavEmails[i].uid == value && myFavEmails[i].emailDomain == emailDomain) {
                myFavEmails[i].flag = 0;
                break;
            }
        }
        this.setState({ favoutiteEmails: myFavEmails });

        removeMailAsFavouriteId(data).then((res) => {

            if (res.data.success == true) {

            } else {
                NotificationManager.error("Please try again later.", "Error");
            }
        }).catch((error) => {

            NotificationManager.error("Please try again later.", "Error");
        });
    }

    showMail(emailDomain, unique_id, value, emailId) {
        let userId = JSON.parse(localStorage.getItem("catchLetterDetails"))._id;
        const data = {
            emailDomain: emailDomain,
            unique_id: unique_id,
            id: JSON.stringify(value),
            user_id: JSON.parse(localStorage.getItem("catchLetterDetails"))._id,
            emailId: emailId
        };
        this.props.onHistory.push({ pathname: "/emailDetail/" + btoa(userId), value: data });
    }


    handleInputChange(event) {
        var change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
    }


    handleSelect(range) {
        let newStartMonth;
        let newEndMonth;

        if (range.startDate != range.endDate) {

        }

        let startDateYear = range.startDate.year();
        let startDateMonth = range.startDate.month();
        let startDateDay = range.startDate.date();

        let endDateYear = range.endDate.year();
        let endDateMonth = range.endDate.month();
        let endDateDay = range.endDate.date();

        if (startDateMonth < 10) {
            newStartMonth = "0" + (startDateMonth + 1);
        }

        if (startDateMonth >= 10) {
            newStartMonth = (startDateMonth + 1);
        }

        if (endDateMonth < 10) {
            newEndMonth = "0" + (endDateMonth + 1);
        }

        if (endDateMonth >= 10) {
            newEndMonth = (endDateMonth + 1);
        }

        let startDate = startDateDay + "/" + newStartMonth + "/" + startDateYear;

        let endDate = endDateDay + "/" + newEndMonth + "/" + endDateYear;
        if (startDate != endDate) {
            this.setState({
                IsShowDatePicker: false,
                date: startDate + "-" + endDate
            });

            if (startDate && endDate) {
                this.setState({
                    sDate: startDate,
                    eDate: endDate,
                    hideButtonDate: true
                });

                this.setState({
                    isLength: false
                });
                // const data = {
                //     startDate: startDate,
                //     endDate: endDate
                // };
                let requestBody = {};
                requestBody.fromDate = startDate;
                requestBody.toDate = endDate;
                requestBody.id = JSON.parse(localStorage.getItem("catchLetterDetails"))._id;
                if (this.state.selectedEmailDomain) {
                    requestBody.emailDomain = this.state.selectedEmailDomain;
                    requestBody.unique_id = this.state.selectedUniqueId;
                }
                if (this.state.tags && this.state.tags != "alltags") {
                    requestBody.tags = this.state.tags;
                }
                if (this.state.inputText) {
                    requestBody.subject = this.state.inputText;
                }

                getListOfMailsByUserIdWithPagination(requestBody).then((res) => {
                    this.setState({
                        isLength: true
                    });
                    if (res.data.success == true) {
                        for (let i = 0; i < res.data.data.message.length; i++) {
                            res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                        }
                        this.setState({
                            favoutiteEmails: res.data.data.message,
                            totalItemsCount: res.data.data.totalCount
                        });

                    } else {

                        this.setState({
                            favoutiteEmails: [],
                            isLength: true
                        });
                    }

                }).catch((Err) => {

                    this.setState({
                        isLength: true
                    });
                });

            }

        }
    }


    formatDate(date) {
        var dd;
        var ddOne = date.getDate();
        if (ddOne < 10) {
            dd = "0" + ddOne;
        } else {
            dd = ddOne;
        }
        var mm = date.getMonth() + 1;
        const monthName = this.getMonthName(date);
        const dayName = this.getDayName(date.getDay());
        const yyyy = date.getFullYear();
        const newDate = dayName + "," + dd + " " + monthName + " " + yyyy;
        return newDate
    }

    getLastSevennDaysMail(totalMails) {

        var result = [];
        var thirtyResult = [];
        const toDaysDate = this.formatDate(new Date());
        for (var i = 0; i < 7; i++) {
            var d = new Date();
            d.setDate(d.getDate() - i);
            result.push(this.formatDate(d));
        }
        for (var i = 0; i < 30; i++) {
            var d = new Date();
            d.setDate(d.getDate() - i);
            thirtyResult.push(this.formatDate(d));
        }
        let sevenDaysMailCount = 0;
        let thirtyDaysMailCount = 0;
        let todaysMailCount = 0;
        for (let j = 0; j < totalMails.length; j++) {
            // if (totalMails[j].header.date[0].split(" ")[1] < 10) {
            //     if (totalMails[j].header.date[0].split(" ")[1].length != 2) {
            //         dd = "0" + totalMails[j].header.date[0].split(" ")[1];
            //     }
            // } else {
            //     dd = totalMails[j].header.date[0].split(" ")[1];
            // }
            let toCompareData1 = totalMails[j].header.date[0].split(" ")[0] + totalMails[j].header.date[0].split(" ")[1] + " " + totalMails[j].header.date[0].split(" ")[2] + " " + totalMails[j].header.date[0].split(" ")[3];
            // const toCompareData = totalMails[j].header.date[0].split(" ")[0] + dd + " " + totalMails[j].header.date[0].split(" ")[2] + " " + totalMails[j].header.date[0].split(" ")[3];
            if (result.includes(toCompareData1)) {

                sevenDaysMailCount++;
            }
            if (toCompareData1 == toDaysDate) {
                todaysMailCount++;
            }
        }

        for (let k = 0; k < totalMails.length; k++) {
            // if (totalMails[j].header.date[0].split(" ")[1] < 10) {
            //     if (totalMails[j].header.date[0].split(" ")[1].length != 2) {
            //         dd = "0" + totalMails[j].header.date[0].split(" ")[1];
            //     }
            // } else {
            //     dd = totalMails[j].header.date[0].split(" ")[1];
            // }

            let toCompareData = totalMails[k].header.date[0].split(" ")[0] + totalMails[k].header.date[0].split(" ")[1] + " " + totalMails[k].header.date[0].split(" ")[2] + " " + totalMails[k].header.date[0].split(" ")[3];
            // const toCompareData = totalMails[j].header.date[0].split(" ")[0] + dd + " " + totalMails[j].header.date[0].split(" ")[2] + " " + totalMails[j].header.date[0].split(" ")[3];
            if (thirtyResult.includes(toCompareData)) {

                thirtyDaysMailCount++;
            }
        }
        if (sevenDaysMailCount > 0) {
            this.setState({ sevenDaysMailCount: sevenDaysMailCount });
        }
        if (thirtyDaysMailCount > 0) {
            this.setState({ thirtyDaysMailCount: thirtyDaysMailCount });
        }
        if (todaysMailCount > 0) {
            this.setState({ todaysMailCount: todaysMailCount });
        }
        if (sevenDaysMailCount == 0) {
            this.setState({ sevenDaysMailCount: 0 });
        }
        if (thirtyDaysMailCount == 0) {
            this.setState({ thirtyDaysMailCount: 0 });
        }
        if (todaysMailCount == 0) {
            this.setState({ todaysMailCount: 0 });
        }

    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let messageOne;
        if (localStorage.getItem("catchLetterDetails")) {
            let value = JSON.parse(localStorage.getItem("catchLetterDetails"));
            if (value) {

                getListOfMailsByUserId1(value._id).then((res) => {
                    if (res.data.success == true) {

                        this.getLastSevennDaysMail(res.data.data.message);
                        let filterDataArray = res.data.data.message;
                        let totalData = [];
                        filterDataArray.map((item) => {
                            let data = {
                                month: this.getMonthName(item.header.date[0]),
                                data: [item]
                            };
                            totalData.push(data);
                        });
                        //check which months are present
                        totalData = this.checkIfMonthExists(totalData);
                        var finalList = totalData;
                        var services = {};
                        for (var i = 0; i < finalList.length; i++) {
                            var serviceId = finalList[i].month;
                            if (!services[serviceId]) {
                                services[serviceId] = [];
                            }
                            services[serviceId].push(finalList[i]);
                        }
                        finalList = [];
                        for (var groupName in services) {
                            finalList.push({
                                group: groupName,
                                color: services[groupName]
                            });
                        }
                        let datasArray = [];
                        let labelsArray = [];
                        for (let key in finalList) {
                            if (finalList[key].color[0].month) {
                                // let data = { "serviceName": finalList[key].color[0].month, totalCount:finalList[key].color.length  };
                                datasArray.push(finalList[key].color[0].data.length);
                                labelsArray.push(finalList[key].color[0].month);
                            }
                        }
                        let data = {
                            labels: labelsArray,
                            datasets: [{
                                label: "My First dataset",
                                fillColor: "rgba(220,220,220,0.2)",
                                strokeColor: "#007bff",
                                pointColor: "#007bff",
                                pointStrokeColor: "#fff",
                                pointHighlightFill: "#fff",
                                pointHighlightStroke: "#007bff",
                                data: datasArray
                            }]
                        };

                        this.setState({
                            allWebsitesData: data,
                            totalAllWebsitesData: data,
                            totalMailCount: res.data.data.message.length
                        });
                    }
                }).catch((err) => {

                    let totalData = [];
                    totalData = this.checkIfMonthExists(totalData);
                    var finalList = totalData;
                    var services = {};
                    for (var i = 0; i < finalList.length; i++) {
                        var serviceId = finalList[i].month;
                        if (!services[serviceId]) {
                            services[serviceId] = [];
                        }
                        services[serviceId].push(finalList[i]);
                    }
                    finalList = [];
                    for (var groupName in services) {
                        finalList.push({ group: groupName, color: services[groupName] });

                    }
                    let datasArray = [];
                    let labelsArray = [];
                    for (let key in finalList) {
                        if (finalList[key].color[0].month) {
                            // let data = { "serviceName": finalList[key].color[0].month, totalCount:finalList[key].color.length  };
                            datasArray.push(finalList[key].color[0].data.length);
                            labelsArray.push(finalList[key].color[0].month);
                        }
                    }
                    let data = {
                        labels: labelsArray,
                        datasets: [{
                            label: "My First dataset",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "#007bff",
                            pointColor: "#007bff",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "#007bff",
                            data: datasArray
                        }]
                    };
                    this.setState({
                        allWebsitesData: data,
                        totalAllWebsitesData: data,
                        totalMailCount: 0
                    });

                });


                const valueOne = {
                    current_date: new Date(),
                    userId: value._id
                };

                getwebsitebydatecheck(valueOne).then((res) => {
                    if (res.data.success == true) {
                        const message = res.data.data.message;
                        if (message == "You are within billing date.") {


                            /** call rest apis */

                            // billing data
                            const billingData = {
                                userId: value._id
                            };
                            getBillingData(billingData).then((result1) => {

                                if (result1.data.success == true) {
                                    // let billingExpiryValue = result1.data.data.details[0].details[result1.data.data.details[0].details.length - 1].billingDetails[0].expiryDate;
                                    let billingExpiryValue = result1.data.data.details[0].details[result1.data.data.details[0].details.length - 1].billingDetails[0].expiryDate;
                                    if (billingExpiryValue) {
                                        let val = new Date(billingExpiryValue).getDate() - new Date().getDate();
                                        if (new Date(billingExpiryValue).getDate() - new Date().getDate() == 0) {
                                            messageOne = "Your plan is going to expire today";
                                        } else {
                                            messageOne = "Your plan will expire in " + val + " day(s)";
                                        }
                                        if (val != NaN) {
                                            this.setState({
                                                expireMessage: messageOne
                                                // billingExpiryValue: new Date(billingExpiryValue).getDate() - new Date().getDate()
                                            });
                                        }
                                    }
                                }
                            }).catch((error) => {

                            });

                            const data = {
                                id: value._id,
                                page: this.state.pageNumber
                            };
                            getListOfMailsByUserIdWithPagination(data).then((res) => {
                                if (res.data.success == true) {
                                    for (let i = 0; i < res.data.data.message.length; i++) {
                                        // res.data.data.message[i].imageUrl = "http://178.128.176.48:7000/resources/screenshots_" + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                                        res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";

                                    }
                                    this.setState({
                                        favoutiteEmails: res.data.data.message,
                                        totalItemsData: res.data.data.message,
                                        allWebsite: res.data.data.message,
                                        totalItemsCount: res.data.data.totalCount,
                                        initialTotalItemCount: res.data.data.totalCount
                                    });


                                    this.setState({
                                        isLength: true
                                    });

                                } else {
                                    // NotificationManager.error(res.data.data.message, "Error");
                                }
                            }).catch((err) => {
                                this.setState({
                                    isLength: true
                                });

                                // NotificationManager.error(err.response.data.data, "Error");
                            })

                            /** getting all emails */

                            /** getting all tags */
                            getWebsiteTags(value._id).then((tags) => {
                                if (tags.data.success == true) {
                                    this.setState({
                                        Tags: tags.data.data
                                    });
                                }
                            }).catch((error) => {

                            });
                            getWebsitesListByUserId(value._id).then((res) => {
                                if (res.data.success == true) {
                                    this.setState({
                                        websiteList: res.data.data.websiteList
                                    });
                                }
                            }).catch((error) => {

                            });

                        } else if (message == "Billing date is expired.") {
                            this.props.onHistory.push({ pathname: '/billingExpire' });
                        }
                    }
                }).catch((error) => {
                    // this.props.onHistory.push({ pathname: '/billingExpire' });
                });

            }
        }
    }

    getDayName(dd) {
        let dayName;
        switch (dd) {
            case 0:
                dayName = "Sun";
                break;
            case 1:
                dayName = "Mon";
                break
            case 2:
                dayName = "Tue";
                break
            case 3:
                dayName = "Wed";
                break
            case 4:
                dayName = "Thu";
                break
            case 5:
                dayName = "Fri";
                break
            case 6:
                dayName = "Sat";
                break
            default:
                break;
        }
        return dayName;
    }
    getMonthName(mailDate) {
        const newMaildate = new Date(mailDate).getMonth();
        let monthName;
        switch (newMaildate) {
            case 0:
                monthName = "Jan"
                break;
            case 1:
                monthName = "Feb"
                break;
            case 2:
                monthName = "Mar"
                break;
            case 3:
                monthName = "Apr"
                break;
            case 4:
                monthName = "May"
                break;
            case 5:
                monthName = "Jun"
                break;
            case 6:
                monthName = "Jul"
                break;
            case 7:
                monthName = "Aug"
                break;
            case 8:
                monthName = "Sep"
                break;
            case 9:
                monthName = "Oct"
                break;
            case 10:
                monthName = "Nov"
                break;
            case 11:
                monthName = "Dec"
                break;

            default:
                break;
        }
        return monthName;
    }

    search(nameKey, myArray) {
        let toreturnArray = [];
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].month === nameKey) {
                toreturnArray.push(myArray[i]);
                // return myArray[i];
            }
        }
        if (toreturnArray.length > 0) {
            let toreturnObj = { data: toreturnArray };
            return toreturnObj;
        }
    }



    getNoOfMailsByWebsite(emailDomain, unique_id) {

        //let value = JSON.parse(localStorage.getItem("emailDomainDetails"));
        if (emailDomain && unique_id) {
            const data = {
                emailDomain: emailDomain,
                unique_id: unique_id
            };

            getListOfMailsByWebsite(data).then((res) => {

                if (res) {
                    // this.getLastSevennDaysMail(res.data.data.message);
                    let filterDataArray = res.data.data.message;
                    let totalData = [];
                    filterDataArray.map((item) => {
                        let data = { month: this.getMonthName(item.header.date[0]), data: [item] };
                        totalData.push(data);
                    });
                    //check which months are present
                    totalData = this.checkIfMonthExists(totalData);
                    var finalList = totalData;
                    var services = {};
                    for (var i = 0; i < finalList.length; i++) {
                        var serviceId = finalList[i].month;
                        if (!services[serviceId]) {
                            services[serviceId] = [];
                        }
                        services[serviceId].push(finalList[i]);
                    }
                    finalList = [];
                    for (var groupName in services) {
                        finalList.push({ group: groupName, color: services[groupName] });
                    }
                    let datasArray = [];
                    let labelsArray = [];
                    for (let key in finalList) {
                        if (finalList[key].color[0].month) {
                            // let data = { "serviceName": finalList[key].color[0].month, totalCount:finalList[key].color.length  };
                            datasArray.push(finalList[key].color[0].data.length);
                            labelsArray.push(finalList[key].color[0].month);
                        }
                    }
                    let data = {
                        labels: labelsArray,
                        datasets: [{
                            label: "My First dataset",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "#007bff",
                            pointColor: "#007bff",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "#007bff",
                            data: datasArray
                        }]
                    };
                    this.setState({
                        monthlyLineData: data,
                        totalMonthLineData: data
                    });
                }
            }).catch((error) => {


                let dataFour = [];
                // this.getLastSevennDaysMail(dataFour);

                let totalData = [];
                totalData = this.checkIfMonthExists(totalData);
                var finalList = totalData;
                var services = {};
                for (var i = 0; i < finalList.length; i++) {
                    var serviceId = finalList[i].month;
                    if (!services[serviceId]) {
                        services[serviceId] = [];
                    }
                    services[serviceId].push(finalList[i]);
                }
                finalList = [];
                for (var groupName in services) {
                    finalList.push({ group: groupName, color: services[groupName] });

                }
                let datasArray = [];
                let labelsArray = [];
                for (let key in finalList) {
                    if (finalList[key].color[0].month) {
                        // let data = { "serviceName": finalList[key].color[0].month, totalCount:finalList[key].color.length  };
                        datasArray.push(finalList[key].color[0].data.length);
                        labelsArray.push(finalList[key].color[0].month);
                    }
                }
                let data = {
                    labels: labelsArray,
                    datasets: [{
                        label: "My First dataset",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "#007bff",
                        pointColor: "#007bff",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "#007bff",
                        data: datasArray
                    }]
                };
                this.setState({
                    monthlyLineData: data,
                    totalMonthLineData: data
                });

            });
        }
    }

    checkIfMonthExists(totalData) {
        var d = new Date();
        d.setMonth(d.getMonth() - 11);
        const prevdate = d.toLocaleDateString();
        var datearray = prevdate.split("/");
        const isFirefox = typeof InstallTrigger !== 'undefined';
        const isChrome = !!window.chrome && !!window.chrome.webstore;
        let newdate;
        if (isFirefox) {
            newdate = datearray[0] + '/' + datearray[1] + '/' + datearray[2];
        }
        else if (isChrome) {
            newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
            if (new Date(newdate) == "Invalid Date") {
                newdate = datearray[0] + '/' + datearray[1] + '/' + datearray[2];
            }
        } else {
            newdate = datearray[0] + '/' + datearray[1] + '/' + datearray[2];
        }
        if
       (newdate) {
            const monthName = this.getMonthName(newdate);

            const octdate = new Date(new Date(newdate).setDate(new Date(newdate).getDate() + 30));
            const octmonth = this.getMonthName(new Date(new Date(newdate).setDate(new Date(newdate).getDate() + 30)));

            const novdate = new Date(new Date(octdate).setDate(new Date(octdate).getDate() + 30));
            const novmonth = this.getMonthName(new Date(new Date(octdate).setDate(new Date(octdate).getDate() + 30)));

            const decdate = new Date(new Date(novdate).setDate(new Date(novdate).getDate() + 30));
            const decmonth = this.getMonthName(new Date(new Date(novdate).setDate(new Date(novdate).getDate() + 30)));

            const jandate = new Date(new Date(decdate).setDate(new Date(decdate).getDate() + 30));
            const janmonth = this.getMonthName(new Date(new Date(decdate).setDate(new Date(decdate).getDate() + 30)));

            const febdate = new Date(new Date(jandate).setDate(new Date(jandate).getDate() + 30));
            const febmonth = this.getMonthName(new Date(new Date(jandate).setDate(new Date(jandate).getDate() + 30)));

            const marchdate = new Date(new Date(febdate).setDate(new Date(febdate).getDate() + 30));
            const marchmonth = this.getMonthName(new Date(new Date(febdate).setDate(new Date(febdate).getDate() + 30)));

            const aprildate = new Date(new Date(marchdate).setDate(new Date(marchdate).getDate() + 30));
            const aprilmonth = this.getMonthName(new Date(new Date(marchdate).setDate(new Date(marchdate).getDate() + 30)));

            const maydate = new Date(new Date(aprildate).setDate(new Date(aprildate).getDate() + 30));
            const maymonth = this.getMonthName(new Date(new Date(aprildate).setDate(new Date(aprildate).getDate() + 30)));

            const junedate = new Date(new Date(maydate).setDate(new Date(maydate).getDate() + 30));
            const junemonth = this.getMonthName(new Date(new Date(maydate).setDate(new Date(maydate).getDate() + 30)));

            const julydate = new Date(new Date(junedate).setDate(new Date(junedate).getDate() + 30));
            const julymonth = this.getMonthName(new Date(new Date(junedate).setDate(new Date(junedate).getDate() + 30)));

            const augdate = new Date(new Date(julydate).setDate(new Date(julydate).getDate() + 30));
            const augmonth = this.getMonthName(new Date(new Date(julydate).setDate(new Date(julydate).getDate() + 30)));

            const sepdate = new Date(new Date(augdate).setDate(new Date(augdate).getDate() + 30));
            const sepmonth = this.getMonthName(new Date(new Date(augdate).setDate(new Date(augdate).getDate() + 30)));

            let resultObject;
            let finalArray = [];

            resultObject = this.search(monthName, totalData);
            if (!resultObject) {
                finalArray.push({
                    month: monthName,
                    data: []
                });
            }
            else {
                finalArray.push({
                    month: monthName,
                    data: resultObject.data
                })
            }
            resultObject = this.search(octmonth, totalData);
            if (!resultObject) {
                finalArray.push({
                    month: octmonth,
                    data: []
                });
            }
            else {
                finalArray.push({
                    month: octmonth,
                    data: resultObject.data
                })
            }
            resultObject = this.search(novmonth, totalData);
            if (!resultObject) {
                finalArray.push({
                    month: novmonth,
                    data: []
                });
            }
            else {
                finalArray.push({
                    month: novmonth,
                    data: resultObject.data
                })
            }
            resultObject = this.search(decmonth, totalData);
            if (!resultObject) {
                finalArray.push({
                    month: decmonth,
                    data: []
                });
            }
            else {
                finalArray.push({
                    month: decmonth,
                    data: resultObject.data
                })
            }
            resultObject = this.search(janmonth, totalData);
            if (!resultObject) {
                finalArray.push({
                    month: janmonth,
                    data: []
                });
            }
            else {
                finalArray.push({
                    month: janmonth,
                    data: resultObject.data
                })
            }
            resultObject = this.search(febmonth, totalData);
            if (!resultObject) {
                finalArray.push({
                    month: febmonth,
                    data: []
                });
            }
            else {
                finalArray.push({
                    month: febmonth,
                    data: resultObject.data
                })
            }
            resultObject = this.search(marchmonth, totalData);
            if (!resultObject) {
                finalArray.push({
                    month: marchmonth,
                    data: []
                });
            }
            else {
                finalArray.push({
                    month: marchmonth,
                    data: resultObject.data
                })
            }
            resultObject = this.search(aprilmonth, totalData);
            if (!resultObject) {
                finalArray.push({
                    month: aprilmonth,
                    data: []
                });
            }
            else {
                finalArray.push({
                    month: aprilmonth,
                    data: resultObject.data
                })
            }
            resultObject = this.search(maymonth, totalData);
            if (!resultObject) {
                finalArray.push({
                    month: maymonth,
                    data: []
                });
            }
            else {
                finalArray.push({
                    month: maymonth,
                    data: resultObject.data
                })
            }
            resultObject = this.search(junemonth, totalData);
            if (!resultObject) {
                finalArray.push({
                    month: junemonth,
                    data: []
                });
            }
            else {
                finalArray.push({
                    month: junemonth,
                    data: resultObject.data
                })
            }
            resultObject = this.search(julymonth, totalData);
            if (!resultObject) {
                finalArray.push({
                    month: julymonth,
                    data: []
                });
            }
            else {
                finalArray.push({
                    month: julymonth,
                    data: resultObject.data
                })
            }
            resultObject = this.search(augmonth, totalData);
            if (!resultObject) {
                finalArray.push({
                    month: augmonth,
                    data: []
                });
            }
            else {
                finalArray.push({
                    month: augmonth,
                    data: resultObject.data
                })
            }
            return finalArray;
        }

    }

    handleChange(event) {
        var change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
        this.setState({
            selectedWesbite: event.target.value
        })
        let requestBody = {};
        if (event.target.name == "website_name") {


            this.setState({
                isLength: false
            });
            if (this.state.tags && this.state.tags != "alltags") {
                requestBody.tags = this.state.tags;
            }
            if (this.state.inputText) {
                requestBody.subject = this.state.inputText;
            }
            if (this.state.sDate && this.state.eDate) {
                requestBody.fromDate = this.state.sDate;
                requestBody.toDate = this.state.eDate;
            }
            if (event.target.value == "allWebsite") {

                let value = JSON.parse(localStorage.getItem("catchLetterDetails"));

                requestBody.id = value._id;
                // this.setState({
                //     selectedEmailDomain: '',
                //     selectedUniqueId: '',
                //     monthlyLineData: '',
                //     selectedWesbite: '',
                //     hiddenTotalGraph: false,
                //     hiddenPerticularGraph: true
                // });
                this.setState({
                    hiddenTotalGraph: false,
                    hiddenPerticularGraph: true
                });

            } else {
                let emailDomain;
                let unique_id;
                const toCompare = event.target.value;
                this.state.websiteList.map((item) => {
                    if (item.website_name == toCompare) {
                        emailDomain = item.emailDomain;
                        unique_id = item.unique_id;
                    }
                });
                this.setState({
                    selectedEmailDomain: emailDomain,
                    selectedUniqueId: unique_id,
                    // hiddenTotalGraph: true,
                    // hiddenPerticularGraph: false
                })
                requestBody.emailDomain = emailDomain;
                requestBody.unique_id = unique_id;
                // this.getNoOfMailsByWebsite(emailDomain, unique_id);
            }

            getListOfMailsByUserIdWithPagination(requestBody).then((res) => {
                this.setState({
                    isLength: true
                });
                if (res.data.success == true) {
                    for (let i = 0; i < res.data.data.message.length; i++) {
                        res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                    }
                    this.setState({
                        favoutiteEmails: res.data.data.message,
                        totalItemsCount: res.data.data.totalCount
                    });



                } else {

                    this.setState({
                        favoutiteEmails: [],
                        isLength: true
                    })
                }

            }).catch((error) => {

                this.setState({
                    isLength: true,
                    favoutiteEmails: []
                })
            });

        }
    }


    searchMails() {

        this.setState({
            isLength: false
        });
        let requestBody = {};
        requestBody.id = JSON.parse(localStorage.getItem("catchLetterDetails"))._id;
        if (this.state.selectedEmailDomain) {
            requestBody.emailDomain = this.state.selectedEmailDomain;
            requestBody.unique_id = this.state.selectedUniqueId;
        }
        if (this.state.sDate && this.state.eDate) {
            requestBody.fromDate = this.state.sDate;
            requestBody.toDate = this.state.eDate;
        }
        if (this.state.inputText) {
            requestBody.subject = this.state.inputText;
        }
        if (this.state.tags && this.state.tags != "alltags") {
            requestBody.tags = this.state.tags;
        }

        getListOfMailsByUserIdWithPagination(requestBody).then((res) => {
            this.setState({
                isLength: true
            });
            if (res.data.success == true) {
                for (let i = 0; i < res.data.data.message.length; i++) {
                    res.data.data.message[i].imageUrl = _imageURL + res.data.data.message[i].emailDomain + "_" + res.data.data.message[i].uid + ".png";
                }
                this.setState({
                    favoutiteEmails: res.data.data.message,
                    totalItemsCount: res.data.data.message.length
                });


            } else {

                this.setState({
                    favoutiteEmails: [],
                    isLength: true
                });
            }

        }).catch((Err) => {

            this.setState({
                isLength: true,
                favoutiteEmails: []
            });
        })

    }

    goPaymentPage() {
        this.props.onHistory.push({ pathname: "/billing" });
    }

    closeDatePicker() {
        this.setState({
            IsShowDatePicker: false,
            hideButtonDate: true
        });
    }

    render() {

        return (
            <div className="body-area-custom no-bg">
                <section className="top-star-row ">
                    <div className="container">
                        <div className="white-bg py-5">
                            {/* {
                            this.state.expireMessage.length != 0 ?
                                <div className="alert alert-warning" role="alert">

                                   
                                    {this.state.expireMessage}, please enter your <a style={{ color: "#007bff", cursor: "pointer" }} onClick={() => this.goPaymentPage()}>payment details</a> in order to continue to use catchLetter and to not lose your email history
                                </div> : ''

                        } */}

                            <div className="top-h mb-3 border-bottom" style={{ "padding-bottom": "1.5em" }}>
                                <h1>Dashboard</h1>
                            </div>
                            {/* <div className="filter-bar py-2 mb-4">
                            <div className="row">
                                <div className="col-12">
                                    <div className="f-bx">
                                        <select className="form-control" name="website_name" onChange={this.handleChange.bind(this)}>
                                            <option value="allWebsite">All Websites</option>
                                            {
                                                this.state.websiteList.length != 0 ? this.state.websiteList.map((result, i) =>
                                                    <option key={i} value={result.website_name}>{result.website_name}</option>
                                                ) : (
                                                        ''
                                                    )
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                            {/* <div className="filter-bar py-3"> */}
                            {/* <div className="row">
                                <div className="col-12 col-md-6 col-lg-3">
                                    <div className="f-bx input-box" style={{ overflow: 'hidden' }}>
                                        {
                                            this.state.IsShowDatePicker ? (
                                                <DateRange
                                                    // onInit={this.handleSelect}
                                                    calendars={1}
                                                    onChange={this.handleSelect.bind(this)}
                                                    maxDate={moment().add('days', 1)}
                                                    startDate={this.state.sDate}
                                                    endDate={this.state.eDate}
                                                />
                                            ) : (
                                                    <div>
                                                        <input type="text" className="form-control" placeholder="Enter Date" onFocus={this.handleDate.bind(this)} value={this.state.date} />
                                                        <button className="right-btn" type="submit"> <i className="fa fa-calendar"></i></button>
                                                    </div>
                                                )
                                        }


                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-3">
                                    <div className="f-bx input-box">
                                        <select className="form-control" name="website_name" onChange={this.handleChange.bind(this)}>
                                            <option value="allWebsite">All Websites</option>
                                            {
                                                this.state.websiteList.length != 0 ? this.state.websiteList.map((result, i) =>
                                                    <option key={i} value={result.website_name}>{result.website_name}</option>
                                                ) : (
                                                        ''
                                                    )
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-3">
                                    <div className="f-bx input-box">
                                        <select className="form-control" name="tags" onChange={this.handleTagsChange.bind(this)}>
                                            <option value="alltags">All Websites Tags</option>
                                            {
                                                this.state.Tags.length != 0 ? this.state.Tags.map((result, i) =>
                                                    <option key={i} value={result.text}>{result.text}</option>
                                                ) : (
                                                        ''
                                                    )
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-3">
                                    <div className="input-box clearfix">
                                        <input id="search" name="inputText" placeholder="Search subject" className="input-field" onChange={this.handleInputChange.bind(this)} value={this.state.inputText} />
                                        <button className="right-btn" type="submit" onClick={() => this.searchMails()}> <i className="fa fa-search" /></button>
                                    </div>
                                </div>
                            </div> */}
                            {/* </div> */}
                        </div>
                    </div>
                </section>
                <section className="container">
                    <div className="white-bg graph-area">
                        <div className="row">
                            <div className="col-12">
                                <section className="graph" hidden={this.state.hiddenTotalGraph}>
                                    <div className="graph-wrap">
                                        {/* <Line data={data} width="500" height="250" /> */}

                                        {

                                            this.state.allWebsitesData ? (
                                                <div>
                                                    <h2 className="title">Graph for All Websites</h2>
                                                    <Line data={this.state.allWebsitesData} width="500" height="250" />
                                                </div>

                                            ) : (
                                                    <div className="p-4">Loading..</div>
                                                )
                                        }

                                    </div>
                                </section>

                                <section className="graph" hidden={this.state.hiddenPerticularGraph}>
                                    <div className="graph-wrap">


                                        {
                                            this.state.monthlyLineData ? (
                                                <div>
                                                    <h2 className="title">Graph for {this.state.selectedWesbite}</h2>
                                                    <Line data={this.state.monthlyLineData} width="500" height="250" />
                                                </div>

                                            ) : (
                                                    <div className="p-4">Loading..</div>
                                                )
                                        }


                                    </div>
                                </section>
                            </div>
                            <div className="col-12">
                                <div className="top-statics">
                                    <h2 className="title">Email Statistics</h2>
                                    <ul className="list-inline mb-3 d-flex justify-content-between flex-wrap">
                                        <li>

                                            <p>today</p>
                                            <strong>{this.state.todaysMailCount}</strong>

                                        </li>
                                        <li>

                                            <p>Last 7 Day</p>
                                            <strong>{this.state.sevenDaysMailCount}</strong>

                                        </li>
                                        <li>

                                            <p>Last 30 Day</p>
                                            <strong>{this.state.thirtyDaysMailCount}</strong>

                                        </li>
                                        <li>

                                            <p>All time</p>
                                            <strong>{this.state.totalMailCount}</strong>

                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="tabel-list">
                    <div className="list-table">
                        <div className="container">
                            <div className="white-bg">
                                <div className="filter-bar py-3">
                                    <div className="row">
                                        <div className="col-12 col-md-6 col-lg-3 col-cal-input">
                                            <div className="f-bx input-box" style={{ overflow: 'hidden' }}>
                                                <button hidden={this.state.hideButtonDate} onClick={() => this.closeDatePicker()} class="btn btn-primary btn-sm btn-calender-close"><i class="fa fa-close"></i></button>
                                                {
                                                    this.state.IsShowDatePicker ? (
                                                        <DateRange
                                                            // onInit={this.handleSelect}
                                                            calendars={1}
                                                            onChange={this.handleSelect.bind(this)}
                                                            maxDate={moment().add('days', 1)}
                                                            startDate={this.state.sDate}
                                                            endDate={this.state.eDate}
                                                        />
                                                    ) : (
                                                            <div>
                                                                <input type="text" className="form-control" placeholder="Enter Date" onFocus={this.handleDate.bind(this)} value={this.state.date} />
                                                                <button className="right-btn" type="submit"> <i className="fa fa-calendar"></i></button>
                                                            </div>
                                                        )
                                                }

                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-3">
                                            <div className="f-bx input-box">
                                                <select className="form-control" name="website_name" onChange={this.handleChange.bind(this)}>
                                                    <option value="allWebsite">All Websites</option>
                                                    {
                                                        this.state.websiteList.length != 0 ? this.state.websiteList.map((result, i) =>
                                                            <option key={i} value={result.website_name}>{result.website_name}</option>
                                                        ) : (
                                                                ''
                                                            )
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-3">
                                            <div className="f-bx input-box">
                                                <select className="form-control" name="tags" onChange={this.handleTagsChange.bind(this)}>
                                                    <option value="alltags">All Websites Tags</option>
                                                    {
                                                        this.state.Tags.length != 0 ? this.state.Tags.map((result, i) =>
                                                            <option key={i} value={result.text}>{result.text}</option>
                                                        ) : (
                                                                ''
                                                            )
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-3">
                                            <div className="input-box clearfix">
                                                <input id="search" name="inputText" placeholder="Search subject" className="input-field" onChange={this.handleInputChange.bind(this)} value={this.state.inputText} />
                                                <button className="right-btn" type="submit" onClick={() => this.searchMails()}> <i className="fa fa-search" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {/*end of top statics*/}
                                {/* <div className="recent-mails">
                                <div className="border-bottom-light headings">
                                    <div className="d-flex justify-content-between">
                                        <h2 className="border-0">Recent emails</h2>
                                        <div className="select-r-box ">
                                            <select className="form-control mr-2">
                                                <option>last-5</option>
                                                <option>1-50</option>
                                            </select>
                                            <select className="form-control">
                                                <option>All</option>
                                                <option>1-50</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-view">
                                    <ul className="list-unstyled my-5">
                                        <li>
                                            <p>Hubspot</p>
                                            <p>welcome to hubspot and thank you for subscribing</p>
                                            <p>02h 20min</p>
                                        </li>
                                        <li>
                                            <p>Hubspot</p>
                                            <p>welcome to hubspot and thank you for subscribing</p>
                                            <p>2days 20min</p>
                                        </li>
                                        <li>
                                            <p>Hubspot</p>
                                            <p>welcome to hubspot and thank you for subscribing</p>
                                            <p>1month ago</p>
                                        </li>
                                        <li>
                                            <p>Hubspot</p>
                                            <p>welcome to hubspot and thank you for subscribing</p>
                                            <p>02h 20min</p>
                                        </li>
                                        <li>
                                            <p>Hubspot</p>
                                            <p>welcome to hubspot and thank you for subscribing</p>
                                            <p>02h 20min</p>
                                        </li>
                                        <li>
                                            <p>Hubspot</p>
                                            <p>welcome to hubspot and thank you for subscribing</p>
                                            <p>2days ago</p>
                                        </li>
                                        <li>
                                            <p>Hubspot</p>
                                            <p>welcome to hubspot and thank you for subscribing</p>
                                            <p>02h 20min</p>
                                        </li>
                                        <li>
                                            <p>Hubspot</p>
                                            <p>welcome to hubspot and thank you for subscribing</p>
                                            <p>10 days ago</p>
                                        </li>
                                        <li>
                                            <p>Hubspot</p>
                                            <p>welcome to hubspot and thank you for subscribing</p>
                                            <p>02h 20min</p>
                                        </li>
                                    </ul>
                                </div>
                            </div> */}

                                <section className="top-star-row py-4 mt-2">
                                    <div className="container">
                                        {/* <div className="top-h mb-4">
                                        <h1>Recent Emails</h1>
                                    </div> */}
                                        {/* <div className="filter-bar py-2 mb-4">
                                        <div className="row">
                                            <div className="col-12 col-md-6 col-lg-3">
                                                <div className="f-bx">
                                                    {
                                                        this.state.IsShowDatePicker ? (
                                                            <DateRange
                                                                // onInit={this.handleSelect}
                                                                calendars={1}
                                                                onChange={this.handleSelect.bind(this)}
                                                                maxDate={moment().add('days', 1)}
                                                                startDate={this.state.sDate}
                                                                endDate={this.state.eDate}
                                                            />
                                                        ) : (
                                                                <input type="text" className="form-control" placeholder="Enter Date" onFocus={this.handleDate.bind(this)} value={this.state.date} />
                                                            )
                                                    }


                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 col-lg-3">
                                                <div className="f-bx">
                                                    <select className="form-control" name="website_name" onChange={this.handleChange.bind(this)}>
                                                        <option value="allWebsite">All Websites</option>
                                                        {
                                                            this.state.websiteList.length != 0 ? this.state.websiteList.map((result, i) =>
                                                                <option key={i} value={result.website_name}>{result.website_name}</option>
                                                            ) : (
                                                                    ''
                                                                )
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 col-lg-3">
                                                <div className="f-bx">
                                                    <select className="form-control" name="tags" onChange={this.handleTagsChange.bind(this)}>
                                                        <option value="alltags">All Websites Tags</option>
                                                        {
                                                            this.state.Tags.length != 0 ? this.state.Tags.map((result, i) =>
                                                                <option key={i} value={result.text}>{result.text}</option>
                                                            ) : (
                                                                    ''
                                                                )
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 col-lg-3">
                                                <div className="input-box clearfix">
                                                    <input id="search" name="inputText" placeholder="Search subject" className="input-field" onChange={this.handleInputChange.bind(this)} value={this.state.inputText} />
                                                    <button className="right-btn" type="submit" onClick={() => this.searchMails()}> <i className="fa fa-search" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                        {/*end of filter bar*/}

                                        <div className="mail-cards new-mail-cards p-0">
                                            <div className="row">

                                                {this.renderFavouriteEmails()}
                                            </div>
                                        </div>
                                        <div>
                                            <Pagination
                                                activePage={this.state.pageNumber}
                                                itemsCountPerPage={10}
                                                totalItemsCount={this.state.totalItemsCount}
                                                pageRangeDisplayed={2}
                                                onChange={this.handlePageChange.bind(this)}
                                            />
                                        </div>
                                    </div>
                                </section >
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default Home;