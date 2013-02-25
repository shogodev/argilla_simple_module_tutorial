/*
Name:      File Uploader
Use with:  jQuery
Version:   0.1.0 (24.09.2009)
Author:    Andrey Sidorov (Shogo.RU)


������������ �������� � ����������� �����������:
$(selector).file_uploader(
  onchange,           // callback �-��, ���������� ��� ������ �����
  onsuccessfulupload  // callback �-��, ���������� ����� �������� �������� ����� �� ������
);

��������� �������� ���� ������������ input ���������:
$.upload_files(callback);
*/

;(function($)
{
  var files = [];
  var files_new = [];

  //-----------------------------------------------------------------------------
  // file_uploader(onchange, onsuccessfulupload)
  // ������������ input ������� � ����������� �����������
  //-----------------------------------------------------------------------------
  $.fn.file_uploader = function(onchange, onsuccessfulupload)
  {
    return this.each(function()
    {
      // ����������� � ����������� ������������
      if( onchange )
      {
        this.change_callbacks = [onchange];
        $(this).change(onchange);
      }
      else
        this.change_callbacks = [];

      if( onsuccessfulupload )
        this.upload_callbacks = [onsuccessfulupload];
      else
        this.upload_callbacks = [];

      // ����������� �����
      files.push(this);
    });
  };
  //-----------------------------------------------------------------------------


  //-----------------------------------------------------------------------------
  // upload_files(callback)
  // �������� ������ � ������������ �������
  //-----------------------------------------------------------------------------
  $.upload_files = function(callback)
  {
    // ���� ���� �� ������, �� ������� ������� �����
    if( files.length != 0 )
    {
      if( files[0].value == '' )
      {
        files_new.push(files[0]);
        files = files.slice(1);
        $.upload_files(callback);
        return;
      }
    }
    // ������� ��������� ��������
    if( files.length == 0 )
    {
      files = files_new;
      files_new = [];

      callback(true);
      return;
    }

    // ���������
    var url = (document.location.protocol + '//' + document.location.hostname + document.location.pathname + document.location.search).replace(/#.*$/, '');
    var ifrid = (new Date()).getTime();
    var params = '$js';

    // ����� � �������
    var form = $('<div style="position: absolute; display: none"><form action="'+url+(url.match(/\?/)?'&':'?')+params+'" method="post" enctype="multipart/form-data" target="file_upload_iframe_'+ifrid+'"><input type="submit" value="submit"><input type="hidden" name="$file" value="true"></form><iframe name="file_upload_iframe_'+ifrid+'" id="file_upload_iframe_'+ifrid+'" style="width:0px;height:0px;overflow:hidden;border:none;"></iframe></div>')[0];
    document.body.appendChild(form);

    // ��������� file �������, ������ ����� �� ����� �������, � ������ �������� � ������������� �����,
    // ��� �� ������ �� ����� ������� onchange ���������� ������� ��������
    var file_old = files[0];
    var file_new = $(files[0]).clone(true)[0];
    files_new.push(file_new);

    file_old.parentNode.insertBefore(file_new, file_old);
    file_old.setAttribute('name', file_old.getAttribute('id').match(/-(\w+)/)[1]);
    form.childNodes[0].appendChild(file_old);

    file_new.value = '';
    // src_var - ���������� �� ���� form, ������������ �������� ������� ��������
    file_new.change_callbacks = file_old.change_callbacks;
    file_new.upload_callbacks = file_old.upload_callbacks;

    $(form.childNodes[1]).load(function(e)
    {
      // ��������� ������ �������
      // ����� ���������� � ���� �� �������, ��� � ��� ajax ��������
      var activator = e.target;
      var response = (activator.contentDocument || activator.contentWindow.document).body.innerHTML;

      var resp = {};
      try
      {
        if( response == '' )
          return;
        eval("resp="+response);
      }
      catch(e)
      {
        alert(e+'\n\n'+response);
      };

      // �������� ������ �������
      var filename = $HAR(resp) ? resp.filename : "";
      // ���������� ����������� js ������������� ��������
      for( var j = 0; j < file_new.upload_callbacks.length; j++ )
        file_new.upload_callbacks[j].apply(file_new, [filename]);

      // �������� form � ��� ��������
      setTimeout(function() { $(form).remove(); }, 0);
      // ��� �� �������� ���� div ���� �������, �� ���� ��� ������, � ��������� �������� ���������

      // ����������� ����� upload_files
      files = files.slice(1);
      $.upload_files(callback);
    });

    // ������ �����
    form.childNodes[0].submit();
  }
})(jQuery);