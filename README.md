# select
select paging, select multiple,select search 

example

   
    $('#offer_select').mySelect({
        $ajax:{
            'url':'/admin/offer/get_all_offer_info_pages',
            'type':'post',
            'data':{'page_no':'page_no','page_count':'page_count','filter_name':'filter_name'},
            'success':{'data_list':'data','total_count':'total_count'}
        },
        'width':'340px',
        'text':'offer_info_name',
        'value':'offer_id',
        'all':{value:0},
        'allName':'All Offers',
        'setValue':0,
        'filterValue':{filter_name:'offer_type',filter_value:[2],filter_type:false},
        'selectValue':function(){edit_group.data.offer_id($('#offer_select').attr('value'))},
        'callBack':function () {edit_group.loading(false)}
    })
