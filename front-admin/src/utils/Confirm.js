import {ElMessageBox} from 'element-plus'

const Confirm = (message, okfun) => {
    ElMessageBox.confirm(message, 'Hint', {
        "confirm-button-text": "yes",
        "cancel-button-class": "cancel",
        "type": "info"
    }).then(async () => {
        okfun();
    }).catch(() => {

    });
}
export default Confirm;