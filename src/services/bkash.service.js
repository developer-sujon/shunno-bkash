//external lib import
const mongoose = require('mongoose');
const https = require('https');
const crypto = require('crypto');

const { validateUrl } = require('../validations/formValidation');

/**
 * @desc bkash webhook notification
 * @returns {Promise<bkash>}
 */

const webhookNotification = (messageType, payload) => {
  const signingCertURL = payload['SigningCertURL'];
  const certUrlValidation = validateUrl(signingCertURL);

  if (certUrlValidation) {
    getCertContent(signingCertURL).then((pubCert) => {
      const signature = Buffer.from(payload['Signature'], 'base64');
      const content = getStringToSign(payload);

      if (content) {
        const verified = true;

        if (verified) {
          if (messageType === 'SubscriptionConfirmation') {
            const subscribeURL = payload['SubscribeURL'];
            console.log('Subscribe', subscribeURL);

            // Subscribe
            https.get(subscribeURL);
          } else if (messageType === 'Notification') {
            const notificationData = payload['Message'];
            console.log('NotificationData-Message', notificationData);
          }
        }
      }
    });
  }

  return payload;
};

function getCertContent(certURL) {
  return new Promise((resolve, reject) => {
    https.get(certURL, (response) => {
      let certContent = '';

      response.on('data', (data) => {
        certContent += data;
      });

      response.on('end', () => {
        resolve(certContent);
      });

      response.on('error', (error) => {
        reject(error);
      });
    });
  });
}

function getStringToSign(message) {
  const signableKeys = ['Message', 'MessageId', 'Subject', 'SubscribeURL', 'Timestamp', 'Token', 'TopicArn', 'Type'];

  let stringToSign = '';

  if (message['SignatureVersion'] !== '1') {
    const errorLog = `The SignatureVersion ${message['SignatureVersion']} is not supported.`;
    console.log('SignatureVersion-Error', errorLog);
  } else {
    signableKeys.forEach((key) => {
      stringToSign += `${key}:${message[key]}\n`;
    });

    console.log('StringToSign', stringToSign + '\n');
  }

  return stringToSign;
}

module.exports = {
  webhookNotification,
};
