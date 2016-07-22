# select
select paging, select multiple,select search 

example

$('#publish_select').mySelect({

      'url':'/api/pub_info',
                'width':'200px',
                'text':'name',
                'value':'id',
                'all':{value:-1},
                'setValue':-1,
                'selectValue':function(){
                    self.form.publisher_id($('#publish_select').attr('data-value'))
                },
                'callBack':function(){
                    flag2 = true;
                    flag1&&flag2&&flag3 ? self.loading(false):'';
                }
            })
