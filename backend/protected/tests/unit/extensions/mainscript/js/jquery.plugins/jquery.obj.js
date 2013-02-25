/*
Name:      Object Tools
Use with:  jQuery
Version:   1.0.6 (06.05.2011)
Author:    Grigory Zarubin, Andrey Sidorov (Shogo.RU)


����� ������� ��� ������ � ������.
*/

;(function($) {
  $.obj = {
    // ���������� ������
    $specialChars: {
      '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\'
    },
    $replaceChars: function(chr) {
      return this.$specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
    },

    // ����������� ������ � json
    parse: function(hash) {
      var self = this;
      switch(typeof(hash)) {
        case 'string':
          return "\"" + hash.replace(/[\x00-\x1f\\"]/g, function(chr){ return self.$replaceChars.apply(self, [chr]); }) + "\"";
        case 'number':
          return isFinite(hash) ? String(hash) : 'null';
        case 'object':
          if(hash===null) return String(hash);
          var string = [];
          if('length' in hash) {
            for(var i=0,l=hash.length; i<l; i++) {
              if(typeof hash[i]=='undefined') continue;
              string.push(this.parse(hash[i]));
            }
            return '[' + String(string) + ']';
            break;
          }
          for(var i in hash) {
            var json = this.parse(hash[i]);
            if(json) string.push(this.parse(i) + ':' + json);
          }
          return '{' + string + '}';
        default: return String(hash);
      }
      return null;
    },

    // ���������� ���������� ��������� � ���� (����� �������� ������ ������ ��� ���������� �� ��������)
    length: function(hash, exclude) {
      if(!$.isPlainObject(hash)) return null;
      var len = false;
      for(var key in hash) {
        if(exclude && $.inArray(key, exclude)!=-1) continue;
        len++;
      }
      return len;
    },

    // ������� ���� ����
    clone: function(hash) {
      if(!$.isPlainObject(hash)) return hash;
      var newHash = hash.constructor();
      for(var key in hash)
        newHash[key] = this.clone(hash[key]);
      return newHash;
    },

    // ����������� ������ � ���
    hash: function(arr) {
      if(!$.isArray(arr)) return arr;
      if(arr.length==0) return {};
      var hash = {};
      for(var i=0,l=arr.length; i<l; i++)
        hash[i] = arr[i];
      return hash;
    },

    // ����������� ��� � ������ (����� ������� ����� ������ ������ �� ������ � �������� ������ ������ ��� ����������)
    array: function(hash, onlyKeys, exclude) {
      if(!$.isPlainObject(hash)) return hash;
      if($.isEmptyObject(hash)) return [];
      var arr = [];
      for(var key in hash) {
        if(exclude && $.inArray(key, exclude)!=-1) continue;
        arr.push(key);
        if(!onlyKeys) arr.push(hash[key]);
      }
      return arr;
    },

    // ���������� ���� ������� �������� ����
    key: function(hash) {
      if(!$.isPlainObject(hash)) return null;
      for(var key in hash)
        break;
      return key;
    },

    // ���������� ���� ���������� �������� ����
    lastKey: function(hash) {
      if(!$.isPlainObject(hash)) return null;
      for(var key in hash);
      return key;
    }
  };
})(jQuery);