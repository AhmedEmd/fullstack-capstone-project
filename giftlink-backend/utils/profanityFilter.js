const profaneWords = ['badword1', 'badword2', 'badword3']; // Add more words as needed

function isProfane(text) {
    const lowerText = text.toLowerCase();
    return profaneWords.some(word => lowerText.includes(word));
}

module.exports = { isProfane };