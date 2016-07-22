/**
 * Created by zhai yingying  on 2016/7/14.
 */

;(function($,window,document,undefined){
    var DropSelect=function(ele,opt){
        var self=this;
        this.$element=ele;
        this.defaults={
            'url':'',//设置加载的url
            'all':false,//是否显示all 选项，显示并设置其{value：value}
            'width':'200px',
            'text':'name',
            'value':'id',
            'setValue':'',//传递id,设置默认值
            'setMutipleValue':['-1'],//传递id,设置默认值
            'selectValue':'',//进行外部的value 赋值
            'callBack':'',
            'pageCount':20,//设置每次加载的条数 int
            'isMutiple':true
        };
        this.page_no=1;
        this.options= $.extend({},this.defaults,opt)
    }
    DropSelect.prototype={
        init:function(){
           if(this.addHtml()) {
               this.selectDropShow();
               this.getlist(1,this.options.url);
               this.search();
               this.downScroll();
               this.setWidth();
           }


        },
        addHtml:function(){
            var finaished=false;
            var str='<div class="'+$(this.$element).attr('id')+' select-box">'+
                '<div class="select-container">'+
                '<span class="select-text"></span>'+
                '<span class="select-arrow"></span>'+
                '</div>'+
                '<div class="select-drop">'+
                '<div class="search-input">'+
                '<input type="text" id=" search-input"/>'+
                '</div>'+
                '<ul class="search-list"></ul>'+
                '</div>'+
                '</div>';
            $(this.$element).after(str).hide();
            this.parent=$(this.$element).next()
            finaished=true;
            return finaished;
        },
        setWidth:function(){
            $(this.parent).find('.select-container').css('width',this.options.width);
            $(this.parent).find('.select-drop').css('width',this.options.width);
            $(this.parent).find('.search-input').css('width',parseInt(this.options.width)-20+'px');
        },
        selectDropShow:function(){
            var self=this;
            $(self.parent).find('.select-container').click(function(e){
                e.stopPropagation();
                $(this).next('.select-drop').show();
                $(this).find('.select-arrow').addClass('select-down');
            });
            $(self.parent).find('.select-container').next('.select-drop').click(function(e){
                e.stopPropagation();
                $(this).show()
            });
            $(document).bind('click',function(e){
                $(self.parent).find('.select-container').next('.select-drop').hide();
                $(this).find('.select-arrow').removeClass('select-down');
            });

        },
        appendList:function(data,mulitAll){
            var $searchList=($(this.parent).find('.search-list'));
            var self=this;
            if(!self.options.isMutiple) {
                if (self.options.all && self.page_no == 1 && $(self.parent).find('.search-input>input').val().length == 0) {
                    var str = '<li data-id="' + self.options.all.value + '">all </li>';
                    $searchList.append(str)
                }
                $.each(data, function (i, val) {
                    var str = '<li data-id="' + val[self.options.value] + '">' + val[self.options.text] + ' </li>';
                    $searchList.append(str)
                })
                var selectid = $(self.parent).find('.select-text').attr('data-id');
                if (selectid != undefined || selectid != this.options.setValue) {
                    this.setValue(selectid)
                } else {
                    this.options.setValue != '' ? this.setValue() : '';
                }
                this.getValue()
            }else{
                if (self.options.all && self.page_no == 1 && $(self.parent).find('.search-input>input').val().length == 0) {
                    var str = '<li><label><input type="checkbox" data-name="selectItem" data-type="main" value=' + self.options.all.value + '></label>all</li>';
                    $searchList.append(str)
                }
                $.each(data, function (i, val) {
                    var str = '<li><label><input type="checkbox" data-name="selectItem" data-type="minor" value="' + val[self.options.value] + '"></label>' +
                            val[self.options.text] + ' </li>';
                    $searchList.append(str)

                })
                this.options.setMutipleValue.indexOf('-1')!= -1 ? this.setMutipleValue() :this.setMutipleValue(this.mutipleValue);
                this.getMutipleValue()
            }
        },
        getlist:function(page_no,url,filter_name){
            var obj={};
            obj.page_no=page_no;
            this.page_no=page_no;
            obj.page_count=this.options.pageCount;
            obj.filter_name=filter_name
            var self=this;
            $.ajax({
                url: url,
                data:obj,
                type: 'get',
                dataType: 'json',
                success:function(data){
                    self.appendList(data.data[0]);
                    self.dataTotal=data.data[1];
                    self.callBack(self.options.callBack())
                }
            })
        },
        setValue:function(value){
            var self=this;
            value?'':value=self.options.setValue;
            var $oul=$(this.$element).next().find('.search-list');
            var olis=$oul.find('li');
            $.each(olis,function(i,val){
                if($(val).attr('data-id')==value){
                    $(self.parent).find('.select-text').text($(val).html()).attr('data-id',value);
                    $(self.$element).attr('value',value);
                    $(val).addClass('select-bg')
                }
            })

            typeof self.options.selectValue=='function'?self.selectValue(self.options.selectValue):''
        },
        getValue:function(){
            var self=this;
            $(this.parent).find('.search-list>li').bind('click',function(){
                $(self.parent).find('.select-text').text($(this).html()).attr('data-id',$(this).attr('data-id'));
                $(self.$element).attr('value',$(this).attr('data-id'));
                $(self.parent).find('.search-list>li').removeClass('select-bg')
                $(this).addClass('select-bg');
                typeof self.options.selectValue=='function'?self.selectValue(self.options.selectValue):''

            })
        },
        mutipleText:[],
        mutipleValue:[],
        getMutipleValue:function(){
            var self=this;
            //if(self.mutipleValue.indexOf('-1')!=-1) {
            //    var eles = $(self.parent).find('input[data-type=minor]');
            //    $(eles).prop('checked', true)
            //}
            $(this.parent).find('.search-list>li>label>input').unbind('click').bind('click',function(){
                if($(this).attr('data-type')=='main'){
                    var eles = $(self.parent).find('input[data-type=minor]');
                    if($(this).prop('checked')) {
                        $(eles).prop('checked', true)
                        self.mutipleValue=[$(this).val()]
                        self.mutipleText=['all']
                        $(self.parent).find('.select-text').text('all');
                    }else{
                        $(eles).prop('checked', false)
                        self.mutipleValue=[];
                        self.mutipleText=[];
                        $(self.parent).find('.select-text').text('');

                    }
                }else{
                    self.mutipleValue.indexOf('-1')!=-1?self.deleteArray(self.mutipleValue,'-1'):'';
                    self.mutipleText.indexOf('all')!=-1?self.deleteArray(self.mutipleText,'all'):'';
                    if($(this).prop('checked')){
                        self.mutipleText.push($(this).parents('li').text());
                        self.mutipleValue.push($(this).val())
                    }else{
                        self.deleteArray(self.mutipleText,$(this).parents('li').text());
                        self.deleteArray(self.mutipleValue,$(this).val());
                        $(self.parent).find('input[data-type=main]').prop('checked', false)
                    }
                    self.mutipleValue=self.unique(self.mutipleValue)
                    self.mutipleText=self.unique(self.mutipleText)
                    if(self.mutipleText.length>2){
                        $(self.parent).find('.select-text').text(self.mutipleText.length+'selected');
                    }else{
                        $(self.parent).find('.select-text').text(self.mutipleText);
                    }
                }
                $(self.$element).attr('data-value',self.mutipleValue);
                typeof self.options.selectValue=='function'?self.selectValue(self.options.selectValue):''
            })
        },
        setMutipleValue:function(value){
            var self=this;
            value?'':value=self.options.setMutipleValue;
            var $oul=$(this.$element).next().find('.search-list');
            var olis=$oul.find('li>label>input');
            $.each(olis,function(i,val){
                console.log(value.indexOf(Number($(val).val())))
                if(value.indexOf($(val).val())!=-1){
                   $(val).prop('checked',true);
                    self.mutipleText.push($(val).parents('li').text());
                }
            })
            if($(self.parent).find('input[data-type=main]').prop('checked')) {
                var eles = $(self.parent).find('input[data-type=minor]');
                $(eles).prop('checked', true)
            }
            self.mutipleValue=self.unique(self.mutipleValue)
            self.mutipleText=self.unique(self.mutipleText)
            if(self.mutipleText.length>2){
                $(self.parent).find('.select-text').text(self.mutipleText.length+'selected');
            }else{
                $(self.parent).find('.select-text').text(self.mutipleText);
            }
            self.mutipleValue=value
            $(self.$element).attr('data-value',self.mutipleValue);
            typeof self.options.selectValue=='function'?self.selectValue(self.options.selectValue):''
        },

        search:function(){
            var self=this;
            var lazyLayout = self.debounce(function (){
                if ($(this).prop("comStart")) return;
                $(self.parent).find('.search-list').html('')
                self.getlist(1,self.options.url,$(this).val());
            },300);
            $(self.parent).find('.search-input>input').on('input',lazyLayout)
                .on("compositionstart", function(){
                    $(this).prop("comStart", true);
                }).on("compositionend", function(){
                    $(this).prop("comStart", false);
                });
        },
        selectValue:function(callBack){
           callBack();
        },
        callBack:function(callBack){
            typeof callback === "function"?callBack():''
        },
        downScroll:function(){
            var self=this;
            var lazyLayout = this.debounce(function (){
                var scrollTop = $(this)[0].scrollTop;
                var scrollHeight = $(this)[0].scrollHeight;
                var windowHeight = $(this).height()+10;
                if(scrollTop + windowHeight >= scrollHeight && self.dataTotal>self.options.pageCount&&self.dataTotal>self.page_no*self.options.pageCount){
                    self.page_no++;
                    self.getlist(self.page_no,self.options.url,$(self.parent).find('.search-input>input').val());
                }
            },100);
            $(self.parent).find('.search-list').bind('scroll',lazyLayout);
        },
        now : Date.now || function() {
            return new Date().getTime();
        },
        debounce:function(func, wait, immediate) {
            var timeout, args, context, timestamp, result;
            var self=this;
            var later = function() {
                var last = self.now() - timestamp;
                if (last < wait && last >= 0) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                        if (!timeout) context = args = null;
                    }
                }
            };
            return function() {
                context = this;
                args = arguments;
                timestamp = self.now();
                var callNow = immediate && !timeout;
                if (!timeout) timeout = setTimeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                    context = args = null;
                }
                return result;
            };
        },
        deleteArray:function(ary,ele){
            var index=ary.indexOf(ele);
            if(index!=-1){
               ary=ary.splice(index,1)
            }
            return ary;
        },
        unique : function(array) {
            var uniqueArr = [];
            $.each(array, function(i, el){
                if($.inArray(el, uniqueArr) === -1) uniqueArr.push(el);
            });
            return uniqueArr;
    },
    }
    $.fn.mySelect=function(options){
        var dropSelect=new DropSelect(this,options);
        return dropSelect.init()
    }
})(jQuery,window,document);