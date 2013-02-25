/*
Name:      Extended JavaScript Loader & Image Cacher
Use with:  jQuery
Version:   1.0.1 (14.07.2011)
Author:    Grigory Zarubin (Shogo.RU)


���������� ���������� ������� ����������:
$.loadScript(
  url                                   // ���
                                        // ���
  ['url1', 'url2', 'url3'],             // ������ ����� ��������
  {
    charset    : 'utf-8',               // ��������� ������� (������������ ��� ������������ � �������� ���������� ��������)
    modify     : {                      // ������� ������������ (����� ������������ ��� ����, ��� � ����� �����)

      content  : '#container'           // ��������� ��� ������ ������ document.open/close/write/writeln � �������������� ������� ��������� ������ �������
                                           (��������� ��������� ������ ���� jquery-��������, ������������ �������, � ������� ����� ����������� �����)
                                           ��������! ����������� ��������� ���� �����������, ���� � ������������ ������� ������������ ��������� ���� ������!

    },
    onComplete :                        // �������-������� ��� ������ �������, ���������� ����� �������� �������� ���� ��������
      function(data, status, jqXHR),
    onError    :                        // �������-������� ��� ������ �������, ���������� ����� ������� �������� ���� �������� � ������ �����-���� ������
      function(jqXHR, status, error)
  }
);

�������� ��������:
$.cacheImage(
  url                                   // ���
                                        // ���
  ['url1', 'url2', 'url3'],             // ������ ����� ��������
  {
    onComplete :                        // �������-������� ��� ������ �������, ���������� ����� �������� �������� ���� ��������
      function(data, status, jqXHR),
    onError    :                        // �������-������� ��� ������ �������, ���������� ����� ������� �������� ���� �������� � ������, ���� ���� �� ���� �������� �� �����������
      function(jqXHR, status, error)
  }
);
*/

;(function($) {
  // ����� ����������
  $.loadData = function(url, opts, onComplete, onError) {
    var urls = [];
    if($.type(url)==='string') urls.push(url); else urls = url;

    if(!urls.length) {
      if($.type(onError)==='function') onError({}, 'error', 'no items to load');
      return;
    }

    // �������, ��������� ������ ����� ����������� ��������
    var getData = function() {
      var requests = [];
      for(var i=0,l=urls.length; i<l; i++) requests.push($.ajax($.extend({}, {url: urls[i]}, opts)));
      return requests;
    };

    $.when.apply(null, getData()).then(onComplete, onError);
  };



  // ���������� ���������� ������� ����������
  $.loadScript = function(url, options) {
    if(!url) return;
    var opts = $.extend(true, {}, $.loadScript.defaults, options);

    var modify = $.loadScript.modify(url, opts); // ������� ���������� �������������
    for(var i in opts.modify) modify.prepare(i); // ������������: ���������� ����� ��������

    var completes = [], errors = [];
    completes.push(function() {
      for(var i in opts.modify) modify.process(i); // ������������: ��������������� ��� �������)
    });
    errors.push(function() {
      for(var i in opts.modify) modify.fallback(i); // ������������: ������ �������� ��� ������ ��������
    });
    if($.isArray(opts.onComplete)) $.merge(completes, opts.onComplete); else completes.push(opts.onComplete);
    if($.isArray(opts.onError)) $.merge(errors, opts.onError); else errors.push(opts.onError);

    $.loadData(url, { dataType : 'script', scriptCharset : opts.charset }, completes, errors);
    return $;
  };

  // ������ ��� ������� �������������
  $.loadScript.modify = function(url, opts) {
    var context = {}, // ��� ���������� ����� ��������� � �������� �� ��� ������ ������������� �������
        modify = {    // ����� � ��������� ����������, ����� ��������� cleanup �� ������ �������
          // ����������
          prepare: function(i) {
            var val = opts.modify[i];
            switch(i) {
              case 'content':
                context.stack = [];
                context.runtime = {};
                // ����� ����� ����� ��� � ��������� �����
                $.each(['write', 'writeln', 'open', 'close'], function(index, value) {
                  context.runtime[value] = document[value];
                });
                document.write = function() {
                  // ���������� ����� ���� ���������: http://www.w3schools.com/jsref/met_doc_write.asp
                  context.stack.push([].slice.call(arguments).join(''));
                };
                document.writeln = function() {
                  // ������� �� ������ ������ ����� ���������, ����� �� ��������� ����: http://www.w3schools.com/jsref/met_doc_writeln.asp
                  context.stack.push([].slice.call(arguments).join('')+'\r\n');
                };
                document.open = $.noop;
                document.close = $.noop;
              break;
            }
          },
          // ������
          fallback: function(i) {
            var val = opts.modify[i];
            switch(i) {
              case 'content':
              break;
            }
            modify.cleanup(i);
          },
          // ���������
          process: function(i) {
            var val = opts.modify[i];
            switch(i) {
              case 'content':
                $(val).html(context.stack.join(''));
              break;
            }
            modify.cleanup(i);
          },
          // ����� ��������� ������������� (����� ����, ���� �������� ������������ ���� � ��� ������ ����)
          cleanup: function(i) {
            switch(i) {
              case 'content':
                if('runtime' in context) {
                  $.each(context.runtime, function(index, value) {
                    document[index] = value;
                  });
                }
              break;
            }
          }
        };
    return modify;
  };

  $.loadScript.defaults = {
    charset    : 'windows-1251',
    modify     : {},
    onComplete : $.noop,
    onError    : $.noop
  };



  // �������� ��������
  $.cacheImage = function(url, options) {
    if(!url) return;

    // ����������� �� �������� �������������
    var options_ = {};
    if($.isFunction(options)) options_.onComplete = options; else options_ = options;

    var opts = $.extend({}, $.cacheImage.defaults, options_);

    $.loadData(url, { dataType : 'image' }, opts.onComplete, opts.onError);
    return $;
  };

  // ����������� ��������� ��� ��������� ��������
  jQuery.ajaxTransport('image', function(s) {
    if(s.type === 'GET' && s.async) {
      var image;
      return {
        send: function(_, callback) {
          image = new Image();

          function done(status) {
            if(image) {
              var textStatus = (status == 200) ? 'success' : 'image not found',
                  tmp = image;
              image = image.onreadystatechange = image.onerror = image.onload = null;
              callback(status, textStatus, { image : tmp });
            }
          }

          image.onreadystatechange = image.onload = function() {
            done(200);
          };
          image.onerror = function() {
            done(404);
          };

          image.src = s.url;
        },

        abort: function() {
          if(image) {
            image = image.onreadystatechange = image.onerror = image.onload = null;
          }
        }
      };
    }
  });

  $.cacheImage.defaults = {
    onComplete : $.noop,
    onError    : $.noop
  };
})(jQuery);