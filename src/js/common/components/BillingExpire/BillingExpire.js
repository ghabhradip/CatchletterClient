import React, { Component } from 'react';
import Billing from '../Billing/Billing';

let IsLoggedIn = false;

class BillingExpire extends Component {

    constructor(props) {
        super(props);

        if (localStorage.getItem("catchLetterDetails")) {
            IsLoggedIn = true;
        }
        if (IsLoggedIn == false) {
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
                            <h4> Billing Expire</h4>
                        </div>
                        <div className="text-center">
                            <button onClick={() => this.goBillingPage()} className="btn custom-btn">Billing Page</button>
                        </div>
                    </div>
                </div>
                {/* <div >
                    <div id="testContainer" style={{ display: 'none', width: '794px', height: 'auto', margin: 'auto', border: '1px solid #ddd', fontFamily: 'arial', padding: '15px', marginLeft: '3000px' }}>
                        <h1 style={{ fontFamily: 'arial', fontSize: '28px', display: 'block', textAlign: 'center', borderBottom: '1px solid #ddd', paddingBottom: '15px' }} >Receipt for March 2017</h1>

                        <ul style={{ padding: '0px', listStyle: 'none', color: '#5c5a5a', fontSize: '14px', lineHeight: '20px' }}>
                            <li><h3 style={{ fontSize: '18px', marginBottom: '5px' }} >Customer Information</h3></li>
                            <li>Jhon Doe</li>
                            <li>6 East Pleasant Court Hyde Park, MA 02136 , US</li>
                            <li>+5446464654</li>
                            <li>West Bengal</li>
                        </ul>
                        <table width="100%" style={{ border: '1px solid #ddd', borderCollapse: 'collapse' }}>
                            <tr style={{ borderBottom: '1px solid #ddd', color: '#5c5a5a', fontSize: '16px' }}>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Description</th>
                                <th style={{ padding: 10 }}>Date</th>
                                <th style={{ textAlign: 'right', padding: '10px' }}>Amount</th>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ddd', color: '#5c5a5a', fontSize: '16px' }}>
                                <td style={{ textAlign: 'left', padding: '10px' }}>Specifies the alignment of a table according to surrounding text</td>
                                <td style={{ textAlign: 'left', padding: '10px' }}>12 july 2018</td>
                                <td style={{ textAlign: 'left', padding: '10px' }}>$50</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ddd', color: '#5c5a5a', fontSize: '16px' }}>
                                <td style={{ textAlign: 'left', padding: '10px' }}>Specifies the alignment of a table according to surrounding text</td>
                                <td style={{ textAlign: 'left', padding: '10px' }}>12 july 2018</td>
                                <td style={{ textAlign: 'left', padding: '10px' }}>$50</td>
                            </tr>
                        </table>
                    </div>
                </div> */}

            </div>
        )
    }
}

export default BillingExpire;