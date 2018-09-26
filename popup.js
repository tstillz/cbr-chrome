document.addEventListener('DOMContentLoaded', function () {
    let submitBtn = document.getElementById('submitBtn');

    submitBtn.addEventListener('click', function () {
        let inputDataz = document.getElementById('inputBox').value;
        document.getElementById("submitBtn").innerHTML = "Searching....";
        document.getElementById("submitBtn").disabled = true;
        document.getElementById("inputBox").disabled = true;

        let config = chrome.extension.getURL('config.json');
        $.getJSON(config, function (data) {
            let cbURL = data["cb_url"];
            let cbKEY = data["cb_api_key"];
            const sensorURL = cbURL + "/api/v1/sensor";
            const binaryTerms = {
                "md5": "md5",
                "name": "observed_filename",
                "internal": "internal_name",
            };
            const binkeys = Object.keys(binaryTerms);
            let searchPrefix = inputDataz.split(" ")[0];

            if (binkeys.indexOf(searchPrefix) > -1) {
                // TODO: Currently limited to the 10 items limit. Should extend this out in future iterations
                let binaryURL = new URL(cbURL + "/api/v1/binary");
                let searchValue = inputDataz.split(" ")[1];
                let searchString = encodeURIComponent(binaryTerms[searchPrefix] + ":" + searchValue);
                let newUrl = binaryURL + "?q=" + searchString;
                $.ajax({
                    type: "GET",
                    url: newUrl,
                    headers: {'X-Auth-Token': cbKEY},
                    contentType: 'application/json',
                    success: function (data, textStatus, jQxhr) {
                        let masterArray = [];
                        $(jQuery.parseJSON(JSON.stringify(data.results))).each(function () {
                            let masterTable = '<table class="table-bordered table table-striped"> ' +
                                '<tr>' +
                                '<td>Hosts: </td>' +
                                '<th>' + this.host_count + '</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Original Name: </td>' +
                                '<th>' + this.original_filename  + '</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>MD5: </td>' +
                                '<th>' + this.md5  + '</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Size: </td>' +
                                '<th>' + this.orig_mod_len  + '</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Last Seen: </td>' +
                                '<th>' + this.last_seen  + '</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Legal Copyright: </td>' +
                                '<th>' + this.legal_copyright + '</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Signature Status: </td>' +
                                '<th>' + this.digsig_result + '</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Product Version: </td>' +
                                '<th>' + this.product_version + '</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Signature Issuer: </td>' +
                                '<th>' + this.digsig_issuer + '</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Signature Subject: </td>' +
                                '<th>' + this.digsig_subject + '</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Signature Publisher: </td>' +
                                '<th>' + this.digsig_publisher + '</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Is_executable: </td>' +
                                '<th>' + this.is_executable_image + '</th>' +
                                '</tr>' +
                                '<td>Is_64bit: </td>' +
                                '<th>' + this.is_64bit + '</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Product Name: </td>' +
                                '<th>' + this.product_name + '</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>OS Type: </td>' +
                                '<th>' + this.os_type + '</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Observed Endpoints</td>' +
                                '<th>' + this.endpoint.join("<br>") + '</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Observed Filename</td>' +
                                '<th>' + this.observed_filename.join("<br>") + '</th>' +
                                '</tr>' +
                                '</table>';
                            masterArray.push(masterTable)
                        });
                        let total = masterArray.length;

                        let topTotal = '<table class="table-bordered table table-striped"> ' +
                            '<tr>' +
                            '<td>Total Items: </td>' +
                            '<th>' + total + '</th>' +
                            '</tr>' +
                            '<tr>' +
                            '</table>';

                        masterArray.unshift(topTotal);

                        let joinedArrary = masterArray.join(" ");
                        document.getElementById("submitBtn").disabled = false;
                        document.getElementById("inputBox").disabled = false;
                        document.getElementById("submitBtn").innerHTML = "Go!";
                        document.getElementById('results').innerHTML = joinedArrary;
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        document.getElementById("submitBtn").innerHTML = "Go!";
                        document.getElementById("submitBtn").disabled = false;
                        document.getElementById("inputBox").disabled = false;
                        document.getElementById('results').innerHTML = errorThrown;

                    }
                });
            } else {
                // TODO: Page down and search vs downloading the entire sensor list
                $.ajax({
                    type: "GET",
                    url: sensorURL,
                    headers: {'X-Auth-Token': cbKEY},
                    contentType: 'application/json',
                    success: function (data, textStatus, jQxhr) {
                        let masterArray = [];

                        $(jQuery.parseJSON(JSON.stringify(data))).each(function () {
                            let network_adapters = this.network_adapters;
                            let name = this.computer_dns_name;
                            if ((network_adapters.indexOf(inputDataz) > -1) || (name.toLowerCase().indexOf(inputDataz.toLowerCase()) > -1)) {
                                let name = this.computer_dns_name;
                                let os_env = this.os_environment_display_string;
                                let supports_cblr = this.supports_cblr;
                                let reg_time = this.registration_time;
                                let sensor_uptime = this.sensor_uptime;
                                let last_update = this.last_update;
                                let next_checkin_time = this.next_checkin_time;
                                let last_checkin_time = this.last_checkin_time;
                                let uninstalled = this.uninstalled;
                                let sen_id = this.id;
                                let status = this.status;

                                let supports_isolation = this.supports_isolation;
                                let network_adapters = this.network_adapters;

                                let masterTable = '<table class="table-bordered table table-striped"> ' +
                                    '<tr>' +
                                    '<td>Hostname: </td>' +
                                    '<th>' + name + '</th>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td>OS: </td>' +
                                    '<th>' + os_env + '</th>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td>Sensor ID: </td>' +
                                    '<th>' + sen_id + '</th>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td>Network Specs: </td>' +
                                    '<th>' + network_adapters + '</th>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td>CBLR: </td>' +
                                    '<th>' + supports_cblr + '</th>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td>Uptime: </td>' +
                                    '<th>' + sensor_uptime + '</th>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<tr>' +
                                    '<td>Register Time: </td>' +
                                    '<th>' + reg_time + '</th>' +
                                    '</tr>' +
                                    '<td>Last Update: </td>' +
                                    '<th>' + last_update + '</th>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td>Last Check-in: </td>' +
                                    '<th>' + last_checkin_time + '</th>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td>Next Check-in: </td>' +
                                    '<th>' + next_checkin_time + '</th>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td>Uninstalled: </td>' +
                                    '<th>' + uninstalled + '</th>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td>Status</td>' +
                                    '<th>' + status + '</th>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td>Supp. Isolation: </td>' +
                                    '<th>' + supports_isolation + '</th>' +
                                    '</tr>' +
                                    '</table>';
                                masterArray.push(masterTable)
                            }
                        });

                        let total = masterArray.length;

                        let topTotal = '<table class="table-bordered table table-striped"> ' +
                            '<tr>' +
                            '<td>Total Items: </td>' +
                            '<th>' + total + '</th>' +
                            '</tr>' +
                            '<tr>' +
                            '</table>';

                        masterArray.unshift(topTotal);

                        let joinedArrary = masterArray.join(" ");
                        document.getElementById("submitBtn").disabled = false;
                        document.getElementById("inputBox").disabled = false;
                        document.getElementById("submitBtn").innerHTML = "Go!";
                        document.getElementById('results').innerHTML = joinedArrary;
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        document.getElementById("submitBtn").innerHTML = "Go!";
                        document.getElementById("submitBtn").disabled = false;
                        document.getElementById("inputBox").disabled = false;
                        document.getElementById('results').innerHTML = errorThrown;

                    }
                });
            }
        });
    }, false);
}, false);