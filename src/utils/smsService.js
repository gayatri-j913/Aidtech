const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const notifyNearbyHelpers = async (helperPhone, requestDetails) => {
    const message = `New help request nearby!
    Title: ${requestDetails.title}
    Reward: ${requestDetails.coinReward} coins
    Urgency: ${requestDetails.urgencyLevel}/10`;
    
    await twilio.messages.create({
        body: message,
        to: helperPhone,
        from: process.env.TWILIO_PHONE_NUMBER
    });
}

module.exports = notifyNearbyHelpers;