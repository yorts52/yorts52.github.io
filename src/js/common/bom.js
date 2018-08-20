var B = {
    query: function(name, search) {
        var reg = new RegExp('[?&]' + name.toString() + '=([^&#$]+)');
        return ((search || location.search).match(reg) || ['', ''])[1];
    },
    hash: function(name, value, hash) {
        var reg = new RegExp('([#&])' + name.toString() + '=([^&$]+)');
        hash = hash || location.hash;
        if (value) {
            if (reg.test(hash)) {
                hash = hash.replace(reg, ['$1', name, '=', value].join(''));
            } else {
                hash = hash.replace(/([^&]?)&?$/, ['$1', '&', name, '=', value].join(''));
            }
            return (location.hash = hash);
        } else {
            return (hash.match(reg) || ['', '', ''])[2];
        }
    }
};