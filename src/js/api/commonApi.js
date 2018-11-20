import axios from 'axios';
import _baseUrl from '../_baseUrl';

export function customerSignup(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "customerSignup",
        data: data
    })
}


export function customerLogin(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "customerLogin",
        data: data
    })
}

export function addWebsite(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "insertWebsite",
        data: data
    })
}

export function getAllWebsitesByUserIdWithPagination(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "getAllWebsitesByUserIdWithPagination",
        data: data
    })
}

export function getWebsitesListByUserId(userId) {
    return axios({
        method: "GET",
        url: _baseUrl + "getAllWebsitesByUserId/" + userId
    })
}

export function deleteWebsiteById(userId) {
    return axios({
        method: "DELETE",
        url: _baseUrl + "deleteWebsiteById/" + userId
    })
}

export function getWebsiteTags(id) {
    return axios({
        method: "GET",
        url: _baseUrl + "getAllTags/" + id
    })
}

export function findTagsOnInput(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "getWebsitesByHashtags",
        data: data
    })
}

export function sendOtp(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "sendOtp",
        data: data
    })
}

export function resetPassword(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "passwordReset",
        data: data
    })
}


export function setPasswordForNewUser(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "setPasswordForNewUser",
        data: data
    })
}

export function changePassword(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "changePassword",
        data: data
    })
}

export function updateCustomer(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "updateCustomer",
        data: data
    })
}

export function getListOfMailsByWebsite(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "getMyMailsByWebsite",
        data: data
    })
}

export function getCustomerById(userId) {
    return axios({
        method: "GET",
        url: _baseUrl + "getCustomerById/" + userId
    })
}

export function getMailById(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "getMailById",
        data: data
    })
}

export function markMailAsFavourite(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "markMailAsFavouriteId",
        data: data
    })
}

export function removeMailAsFavouriteId(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "removeMailAsFavouriteId",
        data: data
    })
}

export function getPerticularWebsites(websiteId) {
    return axios({
        method: "GET",
        url: _baseUrl + "getPerticularWebsites?id=" + websiteId
    })
}

export function updateParticularWesbite(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "updateParticularWesbite",
        data: data
    })
}

export function getListOfFavouritesByUserId(userId, pageNumber) {
    return axios({
        method: "GET",
        url: _baseUrl + "getListOfFavouritesByUserId/" + userId + "/" + pageNumber
    })
}

export function getFavouriteOnPerticular(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "getListOfFavourites",
        data: data
    })
}

export function getFavouriteMailsByDate(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "getFavouriteMailsByDate",
        data: data
    })
}

export function getListOfMailsByUserId1(userId) {
    return axios({
        method: "GET",
        url: _baseUrl + "getListOfMailsByUserId/" + userId
    })
}

export function getFavouriteMailsByDateForAllWebsites(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "getFavouriteMailsByDateForAllWebsites",
        data: data
    })
}

export function getListOfMailsByUserIdWithPagination(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "getListOfMailsByUserIdWithPagination",
        data: data
    })
}

export function getListOfFavouriteMailsWithPagination(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "getListOfFavouriteMailsWithPagination",
        data: data
    })
}

export function getMyMailsByWebsiteWithPagination(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "getMyMailsByWebsiteWithPagination",
        data: data
    })
}

export function getSubscriptionPlan() {
    return axios({
        method: "GET",
        url: _baseUrl + "getSubscriptionPlan"
    })
}

export function billingResult(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "billingResult",
        data: data
    })
}

export function getwebsitebydatecheck(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "getwebsitebydatecheck",
        data: data
    })
}

export function postGrid(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "postGrid",
        data: data
    })
}

export function getGridType(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "getGridType",
        data: data
    })
}

export function updateDefaultBillingForWeb(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "updateDefaultBillingForWeb",
        data: data
    })
}
export function insertUserForSubscription(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "insertUserForSubscription",
        data: data
    })
}

export function getBillingData(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "getBillingData",
        data: data
    })
}

export function getAllBillingWithPagination(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "getAllBillingWithPagination",
        data: data
    })
}

export function saveAlerts(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "saveAlerts",
        data: data
    })
}

export function getListOfAlertsByUserId(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "getListOfAlertsByUserId",
        data: data
    })
}

export function deleteAlertById(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "deleteAlertsById",
        data: data
    })
}

export function uploadImage(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "uploadImage",
        data: data
    })
}

export function getCountries() {
    return axios({
        method: "GET",
        url: "https://restcountries.eu/rest/v2/all"
    });
}

export function deleteEmail(emailId) {
    return axios({
        method: "DELETE",
        url: _baseUrl + "deleteEmail/" + emailId
    })
}

export function lastSubscriptionDetails(userId) {
    return axios({
        method: "GET",
        url: _baseUrl + "lastSubscriptionDetails/" + userId
    })
}

export function exportWebsite(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "dowloadZipOfWebsite",
        data: data
    })
}

export function createDomain(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "createDomain",
        data: data
    })
}

export function getAllDomains(userId) {
    return axios({
        method: "GET",
        url: _baseUrl + "/getDomainByid/" + userId
    })
}

export function adminAsUserLogin(data) {
    return axios({
        method: "POST",
        url: _baseUrl + "adminLoginAsCustomer",
        data: data
    })
}