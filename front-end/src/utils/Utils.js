export default {
    sizeToStr: (size) => {
        var data = ''
        if (size < 0.1 * 1024) {
            //If it's less than 0.1 kilobytes convert to bytes
            data = size.toFixed(2) + 'B'
        } else if (size < 0.1 * 1024 * 1024) {
            //If less than 0.1MB, convert to KB
            data = (size / 1024).toFixed(2) + 'KB'
        } else if (size < 0.1 * 1024 * 1024 * 1024) {
            //Convert to MB if less than 0.1GB
            data = (size / (1024 * 1024)).toFixed(2) + 'MB'
        } else {
            //Others are converted to GB
            data = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
        }
        var sizestr = data + ''
        var len = sizestr.indexOf('.')
        var dec = sizestr.substr(len + 1, 2)
        if (dec == '00') {
            //We get rid of the decimal part when the decimal point is 00
            return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
        }
        return sizestr
    }
}