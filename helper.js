
const ApiHelper = function () { }

ApiHelper.prototype.validate = async function (request, description, onFailed) {
    let isValid = true;
    let message = "";
    for (let i = 0; i < description.length; i++) {
        let props = description[i];
        try {
            let links = props['link'].split('/');
            if (links.length != 0) {
                let data = request[links[0]];
                if (data != undefined) {
                    for (let j = 1; j < links.length; j++) {
                        data = data[links[j]];
                        if (data == undefined) {
                            throw "not found";
                        }
                    }
                    // Data validating
                    let processResult = {
                        status: true,
                        message: ""
                    };
                    if (props['process'] != undefined) {
                        processResult = await props.process(data);
                    }

                    if (props['onValid'] != undefined) {
                        if (processResult != undefined && processResult.status != undefined && processResult.status) {
                            props.onValid();
                        }
                    }
                    if (processResult == undefined || processResult.status == undefined || !processResult.status) {
                        if (processResult.failedMessage != undefined) {
                            throw processResult.failedMessage;
                        }
                        else {
                            throw "invaild";
                        }
                    }
                }
            }
            else {
                throw "not found";
            }
        }

        catch (e) {
            isValid = false;
            if (props['onInvalid'] != undefined) {
                props.onInvalid();
            }
            if (onFailed != undefined) {
                onFailed(props, message);
            }
            message = e;
            break;
        }
    }
    return { status: isValid, message: message };
}

module.exports = {
    create: ApiHelper
};