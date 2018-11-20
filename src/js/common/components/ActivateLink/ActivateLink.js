import React, { Component } from 'react';
import qs from 'simple-query-string';
import {
    updateCustomer
} from '../../../api/commonApi';
import {
    NotificationManager
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class ActivateLink extends Component {

    componentDidMount() {
        if (this.props && this.props.onHistory.location && this.props.onHistory.location.search) {
            const parsed = qs.parse(this.props.onHistory.location.search);
            const buff = new Buffer(parsed.userId, 'base64');
            const text = buff.toString('ascii');
            const data = {
                _id: text,
                IsUserActive: 1
            }

            updateCustomer(data).then((res) => {
                if (res.data.success === true) {
                    NotificationManager.success("Account activated. Please login to conitnue.", "Success");
                    this.props.onHistory.push({ pathname: '/' });
                } else {
                    NotificationManager.error(res.data.data.message, "Error");
                }
            }).catch((err) => {
                if (err.response.data.success === false) {
                    NotificationManager.error(err.response.data.data.message, "Error");
                }
            });

        }
        else {
            NotificationManager.error("No user id found.", "Error");
            this.props.onHistory.push({ pathname: '/' });
        }
    }
    goBillingPage() {
        this.props.onHistory.push({ pathname: '/billing' });
    }

    render() {
        return (
            <div className="mid-body">
                <div className="container py-5">
                    <div className="div-prt">
                        <div className="text-center">
                            <h4> Please wait we are activating you account.</h4>
                        </div>
                    </div>
                </div>


            </div>
        )
    }
}

export default ActivateLink;