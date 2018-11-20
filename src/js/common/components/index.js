import React, { Component } from 'react';
import Loadable from 'react-loadable';

import Home from './Home/Home';
import SignUp from './SignUp/SignUp';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Login from './Login/Login';
import CreateWebsite from './Websites/Websites';
import WebsitesList from './WebsitesList/WebsitesList';
import ResetPassword from './ResetPassword/ResetPassword';
import Otp from './Otp/Otp';
import Profile from './Profile/Profile';
import MailsByWebsite from './MailsByWebsite/MailsByWebsite';
import EmailDetails from './EmailDetails/EmailDetails';
import WebsiteEdit from './WebsiteEdit/WebsiteEdit';
import FavouriteEmails from './FavouriteEmails/FavouriteEmails';
import Inbox from './Inbox/Inbox';
import Billing from './Billing/Billing';
// import BillingSuccess from './BillingSuccess/BillingSuccess';
import BillingExpire from './BillingExpire/BillingExpire';
// import Receipt from './Receipt/Receipt';
// import Pdf from './Pdf/Pdf';

import Alert from './Alert/Alert';
import CustomDomain from './CustomDomain/CustomDomain';
import CreateCustomDomain from './CreateCustomDomain/CreateCustomDomain';
import CreateAlert from './CreateAlert/CreateAlert';
// import EditAlert from './EditAlert/EditAlert';
import SetPassword from './setPassword/setPassword';
import CreateDomain from './CreateDomain/CreateDomain';
import ActivateLink from './ActivateLink/ActivateLink';
import AdminAsUser from './AdminAsUser/AdminAsUser';

import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { loadProgressBar } from 'axios-progress-bar';
import Favicon from 'react-favicon';

import 'axios-progress-bar/dist/nprogress.css';

// import Loader from 'react-loader-advanced';

const HeaderWithRouter = withRouter(props => <Header {...props} />);
const FooterWithRouter = withRouter(props => <Footer {...props} />);

loadProgressBar();

class Main extends Component {

    render() {
        return (
            <div>
                <Favicon url="https://api.catchletter.com/resources/logo.png" />
                <HeaderWithRouter />
                <NotificationContainer />
                <Route exact path="/" render={({ history }) => (
                    <div>
                        <Login onHistory={history} />
                    </div>
                )} />
                <Route path="/adminLogin" render={({ history }) => (
                    <div>
                        <AdminAsUser onHistory={history} />
                    </div>
                )} />
                <Route path="/signup" render={({ history }) => (
                    <div>
                        <SignUp onHistory={history} />
                    </div>
                )} />
                <Route path="/home" render={({ history }) => (
                    <div>
                        <Home onHistory={history} />
                    </div>
                )} />
                <Route path="/createWebsites" render={({ history }) => (
                    <div>
                        <CreateWebsite onHistory={history} />
                    </div>
                )} />
                <Route path="/list" render={({ history }) => (
                    <div>
                        <WebsitesList onHistory={history} />
                    </div>
                )} />
                <Route path="/resetPassword/:id" render={({ history }) => (
                    <div>
                        <ResetPassword onHistory={history} />
                    </div>
                )} />
                <Route path="/otp" render={({ history }) => (
                    <div>
                        <Otp onHistory={history} />
                    </div>
                )} />
                <Route path="/profile" render={({ history }) => (
                    <div>
                        <Profile onHistory={history} />
                    </div>
                )} />
                <Route path="/websiteMails/:id" render={({ history }) => (
                    <div>
                        <MailsByWebsite onHistory={history} />
                    </div>
                )} />
                <Route path="/emailDetail/:id" render={({ history }) => (
                    <div>
                        <EmailDetails onHistory={history} />
                    </div>
                )} />
                <Route path="/websiteEdit" render={({ history }) => (
                    <div>
                        <WebsiteEdit onHistory={history} />
                    </div>
                )} />
                <Route path="/favourite" render={({ history }) => (
                    <div>
                        <FavouriteEmails onHistory={history} />
                    </div>
                )} />
                <Route path="/inbox" render={({ history }) => (
                    <div>
                        <Inbox onHistory={history} />
                    </div>
                )} />
                <Route path="/billing" render={({ history }) => (
                    <div>
                        <Billing onHistory={history} />
                    </div>
                )} />
                <Route path="/billingExpire" render={({ history }) => (
                    <div>
                        <BillingExpire onHistory={history} />
                    </div>
                )} />
                <Route path="/alerts" render={({ history }) => (
                    <div>
                        <Alert onHistory={history} />
                    </div>
                )} />
                <Route path="/custom-domain" render={({ history }) => (
                    <div>
                        <CustomDomain onHistory={history} />
                    </div>
                )} />
                <Route path="/create-custom-domain" render={({ history }) => (
                    <div>
                        <CreateCustomDomain onHistory={history} />
                    </div>
                )} />
                <Route path="/createAlert" render={({ history }) => (
                    <div>
                        <CreateAlert onHistory={history} />
                    </div>
                )} />
                <Route path="/setpassword" render={({ history }) => (
                    <div>
                        <SetPassword onHistory={history} />
                    </div>
                )} />
                <Route path="/activateLink" render={({ history }) => (
                    <div>
                        <ActivateLink onHistory={history} />
                    </div>
                )} />
                <Route path="/domain" render={({ history }) => (
                    <div>
                        <CreateDomain onHistory={history} />
                    </div>
                )} />
                {/* <FooterWithRouter /> */}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        userData: state.userData
    }
}

export default withRouter(connect(mapStateToProps)(Main));