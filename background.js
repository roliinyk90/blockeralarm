let delay = 5;

chrome.storage.sync.get(['delayTime'], function (result) {
    let delayFromSettings = parseInt(result.delayTime);

    if (delayFromSettings > 0) {
        delay = delayFromSettings
    }
    chrome.alarms.create("blockerAlert", {
        delayInMinutes: delay,
        periodInMinutes: delay
    });
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === "blockerAlert") {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "https://jira.corp.magento.com/rest/greenhopper/1.0/xboard/work/allData/?rapidViewId=964", true);

        xhr.onreadystatechange = function () {

            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    console.log('Sparta Alert blocker get error during GET request, response status:' + xhr.status)
                }
                let resp = JSON.parse(xhr.responseText);
                let issues = resp.issuesData.issues;

                for (let i = 0; i < issues.length; i++) {

                    if (issues[i]['priorityName'] === 'P0' && issues[i]['assignee'] == null
                    && issues[i]['status']['name'] === 'Ready For Development') {

                        chrome.notifications.create('reminder', {
                            type: 'basic',
                            iconUrl: 'https://jira.corp.magento.com/images/icons/priorities/blocker.svg',
                            title: 'Blocker in the queue',
                            message: 'https://jira.corp.magento.com/browse/' + issues[i]['key'],
                            requireInteraction: true
                        }, function (notificationId) {});

                    }
                }

            }
        }
        xhr.send();

    }
});
