import axios from 'axios'

import { ElLoading } from 'element-plus'
import router from '@/router'

import Message from '../utils/Message'

const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8'
const contentTypeJson = 'application/json'

let loading = null;
const instance = axios.create({
    baseURL: '/api',
    timeout: 10 * 1000,
});

instance.interceptors.request.use(
    (config) => {
        if (config.showLoading) {
            loading = ElLoading.service({
                lock: true,
                text: 'Loading...',
                background: 'rgba(0, 0, 0, 0.7)',
            });
        }
        return config;
    },
    (error) => {
        if (config.showLoading && loading) {
            loading.close();
        }
        Message.error("Request failed to send");
        return Promise.reject("Request failed to send");
    }
);

instance.interceptors.response.use(
    (response) => {
        const { showLoading, errorCallback, showError = true } = response.config;
        if (showLoading && loading) {
            loading.close()
        }
        const responseData = response.data;

        if (responseData.code == 200) {
            return responseData;
        } else if (responseData.code == 901) {

            setTimeout(() => {
                router.push("/login")
            }, 2000);
            return Promise.reject({ showError: true, msg: "Timeout" });
        } else {

            if (errorCallback) {
                errorCallback(responseData.info);
            }
            return Promise.reject({ showError: showError, msg: responseData.info });
        }
    },
    (error) => {
        if (error.config.showLoading && loading) {
            loading.close();
        }
        return Promise.reject({ showError: true, msg: "network anomaly" })
    }
);

const request = (config) => {
    const { url, params, dataType, showLoading = true } = config;
    let contentType = contentTypeForm;
    let formData = new FormData();
    for (let key in params) {
        formData.append(key, params[key] == undefined ? "" : params[key]);
    }
    if (dataType != null && dataType == 'json') {
        contentType = contentTypeJson;
    }
    let headers = {
        'Content-Type': contentType,
        'X-Requested-With': 'XMLHttpRequest',
    }
    return instance.post(url, formData, {
        headers: headers,
        showLoading: showLoading,
        errorCallback: config.errorCallback,
        showError: config.showError
    }).catch(error => {
        console.log(error);
        if (error.showError) {
            Message.error(error.msg);
        }
        return null;
    });
};

export default request;
