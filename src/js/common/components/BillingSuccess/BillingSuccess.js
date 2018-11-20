import React, { Component } from 'react';
class BillingSuccess extends Component {
    render() {
        return (
            <div>
                <div className="billing-success d-flex justify-content-center align-items-center">
                    <div className="text-center">
                    <div className="w-100 mb-2">Billing Success</div>        
                    <input id="login" type="button" className="btn btn-primary  btn-sm" value="Submit"/>
                    </div>
                </div>
            </div>
        )
    }
}

export default BillingSuccess;