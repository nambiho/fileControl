/**
 * HSMirae, Inc.
 * File Upload Control
 * 
 * Version : 0.1
 * Created : 2023.5.7
 * Create By : HSMirae, Inc.
 */
//http://sol.hsmirae.com/iwox/akis/bbs/notice.nsf/maindoc?openform&pcontentsid=TC_8B5CFT2010111217541&contentsid=TC_20:56:39_3&tabid=TB_20:56:39_3
//http://sol.hsmirae.com/iwox/akis/bbs/notice.nsf/view_by_datetime/8FFF3BBB30AF34EE492589A9003A46AD?opendocument
//http://sol.hsmirae.com/iwox/akis/bbs/notice.nsf/view_by_datetime/8FFF3BBB30AF34EE492589A9003A46AD?editdocument
/**
 * HSMirae, Inc.
 * File Upload Control
 * 
 * Version : 0.1
 * Created : 2023.5.7
 * Create By : HSMirae, Inc.
 */


var FileUploader = (function (func) {
    return func();
}) (function () {
    const 
	toString = Object.prototype.toString,
	jsonctor = JSON.constructor,
	noop = function () {};

	// is Functions
	const
	isArray = x => Array.isArray(x), //(toString.call(x) === "[object Array]")
	isObject = x => {
		if (!x) return false;
		if (!x.constructor) return false;
		return (!x.constructor.name) ? toString.call(x) === '[object Object]' : x.constructor.name === 'Object'
	},
	isNative = x => isFunction(x) && /native code/.test(x),
	isFunction = x => typeof x === "function",
	isString = x => typeof x === "string",
	isNull = x => toString.call(x) === "[object Null]",
	isUndefined = x => typeof x === "undefined",
	isFalse = x => (isNull(x) || isUndefined(x) || (x === "") || (x === 0) || !x),
    isTrue = x => !(isNull(x) || isUndefined(x) || (x === "") || (x === 0) || !x),
	isJSON = x => !!x && (x.constructor === jsonctor),
	isJsonString = x => {try {return JSON.parse(x) && !!x} catch(e) {return false}},
	isDom = x => x && !!x.nodeName,
	isPlain = x => {
		if (isFalse(x) || !isObject(x)) return false;
		var p=Object.getPrototypeOf(x);
		if (!p) return isJSON(x);
		var ctor=Object.hasOwnProperty.call(p, "constructor") && p.constructor;
		return isFunction(ctor) && isNative(ctor.toLocaleString())
	},
    isRegExp = x => toString(x) === '[object RegExp]'
	;

    const
    selectParser = src => src.replace(/\./g, '\\.'),
    comma = src => src.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    size2byte = src => {
        let val = src / 1024;
        return val > 1024 ? size2kilobyte(val) : comma((Math.round(val * 100) / 100)) + 'KB';
    },
    size2kilobyte = src => {
        let val = src / 1024;
        return val > 1024 ? size2megabyte(val) : comma((Math.round(val * 100) / 100)) + 'MB';
    },
    size2megabyte = src => comma((Math.round(src / 1024) * 100) / 100) + 'GB',
    uniqueKeygen = () => new Date().getTime() + Math.random(),
    defineProperty = function (obj, property, value) {
        return property in obj ? Object.defineProperty(obj, property, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : obj[property] = value,
        obj
    },
    _copy = (origin, source, delPrefix=false) => {
        if (!source) return origin;
		var rtype = isArray(source) ? [] : {},
		result = isObject(origin) ? origin : rtype;
        Object.keys(source).forEach(key => {
            if (delPrefix || key.substring(0, delPrefix.length) === delPrefix) return;
			var val = source[key], x = isArray(val) ? [] : isPlain(val) ? {} : false;
			result[key] = x ? copy(x, val) : val;
        });
        return result;
    },
	copy = (target, ...source) => {
        source.forEach(elem => {
            target = _copy(target, elem);
        });
        return target;
	},
    optionalCopy = (delPrefix=false, target, ...source) => {
        source.forEach(elem => {
            target = _copy(target, elem, delPrefix);
        });
        return target;
    },
    addEvent = (t,/*tp,*/ev,c) => {
		var isListener = !!t.addEventListener;
		if (t && ev) {
			for (var tp in ev) {
				if (isFunction (ev[tp]))
					isListener ? 
						t.addEventListener(tp, ev[tp] || noop, c || false) :
						t.attachEvent('on' + tp, ev[tp] || noop)
			}
		}
	},
	removeEvent = (t,/*tp,*/ev) => {
		var isListener = !!t.removeEventListener;
		if (t && ev) {
			for (var tp in ev) {
				if (isFunction (ev[tp]))
					isListener ? 
						t.removeEventListener(tp, ev[tp] || noop) :
						t.dettachEvent('on' + tp, ev[tp] || noop)
			}
		}
	},
    style = (el,stl) => {
		if (!isObject(stl)) return el;
		for(var x in stl) el.style[x] = stl[x]
	},
    replaceElement = (parent, tags) => {
        return Object.keys(tags).map(tag => {
            let el = parent.querySelector(tag);
            el.replaceWith(tags[tag]);
        }), tags;
    },
    createElement = (_info, obj) => {
        const __ELEMENT_INFOMATION__ = {
            nodeName: 'div',
            attr: {},
            style: {},
            event: {},
            children: [],
            tags: null,
            // children: null,
            // html:'',
            // text:'',
            parent: null
        };

        var info = copy(__ELEMENT_INFOMATION__, _info);
        if (info.tags && info.parent) {const {parent, tags} = info; return replaceElement(parent, tags);}
        
        if (!info.nodeName) return null;
		var el = document.createElement(info.nodeName);
		for(var attr in info.attr) el.setAttribute(attr,info.attr[attr])
		style(el, info.style);
        info.children && el.append.apply(el, info.children)
        info.html && (el.innerHTML = info.html);
        info.text && (el.textContent = info.text);
		info.parent && info.parent.appendChild(el);
        addEvent(el, (function (event) {
			var ret = {};
			for (var ev in event) isFunction(event[ev]) && (ret[ev] = event[ev])
			return ret;
		} (info.event)));

		return el;
	}
    ;


    function reciver (obj) {
        Object.defineProperty(obj, receiver, {
            receiver : function () {}
        });
    }


    /**
     * 
     * option base layout
     * 
     */
    const __FILE_UPLOAD_DEFAULT_OPTIONS__ = {
        selector: '#fileupload_control',
        uploadUrl: '/iwox/upload/attachdb.nsf/UploadForm?openform',
        downloadUrl: '/iwox/akis/bbs/notice.nsf/view_by_datetime/8FFF3BBB30AF34EE492589A9003A46AD/$file/',
        eventArea: 1, // 1 : all pages, 2 : in control
        limitSize: '26214400', // byte, 0 is all, default : 25M, 25600K
        allowext: [], // null is all
        isEditable: true, 
        mode: 1, //1 : list, 2 : grid
    };
    
    /**
     * 
     * run function
     * 
     */
    function runFunctions (functionList, argv) {
        var returnValue;
        var funcArgv = copy({next: true}, argv);
        //var next = true; // because the symbol was released late. 
        for(let name in functionList) {
            returnValue = isFunction(functionList[name]) && functionList[name].call(this, funcArgv);
            if (isFalse(funcArgv.next)) return returnValue;
            else if (isJSON(returnValue)) funcArgv = copy(funcArgv, returnValue);
        }
        return returnValue;
    }

    /**
     * 
     * filerepo
     * 
     */
    function fileRepository () {
        let _values = [];
        return Object.create({
            set values (values) {_values = values},
            get values () {return _values},
            get length () {return _values.length}
        });
    }

    /**
     * 
     * fileservice
     * 
     */
    function fileService (options) {
        var filerepo = fileRepository();

        function _size (files = filerepo.values) {
            let size = 0;
            return files.forEach(file => size += parseInt(file.size)),
            size;
        }

        function _valid (files = filerepo.values) {
            var upperSizeFile = [], denyFile = [];
            return 0,
            upperSizeFile = 
                isFalse(options.limitSize == 0) && files.filter(file => file.size > options.limitSize),
            denyFile = 
                isFalse(options.allowext == '') && 
                isArray(options.allowext) && 
                files.filter(file => options.allowext.indexOf(file.name.split('.').splice(-1).join()) == -1  ),
            upperSizeFile.length && console.error('The file size is large.'),
            denyFile.length && console.error(`Only ${options.allowext.join(', ')} files is available.`),
            {
                ok: isFalse(upperSizeFile.length || denyFile.length), // 값이 없어야 하기 때문에
                upperSizeFile: upperSizeFile,
                denyFile: denyFile,
            };
        }

        function _remove (keys) {
            try {
                for(const i in keys) _remove_only(keys[i])
            } catch (e) {
                console.error(e);
                return !1
            }
            return !0;
        }

        function _remove_only (key) {
            let _repoFiles = filerepo.values;
            let index = _repoFiles.findIndex(value => value.key == key);
            return index != -1 && _repoFiles.splice(index, 1);
        }

        function _add (files) {
            let _repoFiles = filerepo.values;
            _valid(files).ok && (filerepo.values = _repoFiles.concat(files.map(file => {
                return file.where || (file.where = 'onlocal'), file.key = uniqueKeygen(), file
            } )));
        }

        function _getMatchFiles (name, value) {
            let _repoFiles = filerepo.values;
            
            return _repoFiles.filter(_file => _file[name] && (_file[name] == value));
        }

        return Object.create({
            add (files) { _add (files) },
            valid (files) {
                return _valid(files).ok;
            },
            remove (keys) {
                return _remove(keys);
            },
            getFiles () {
                return filerepo.values;
            },
            getSize () {
                return _size();
            },
            getServerFiles () {
                return _getMatchFiles('where', 'onserver');
            },
            getLocalFiles () {
                return _getMatchFiles('where', 'onlocal');
            },
            getMatchFiles (name, value) {
                if (isFalse(name)) return [];
                return _getMatchFiles(name, value);
            },
            getLength () {
                return filerepo.values.length;
            }
        });
    }

    /**
     * {next}
     * run sequentially
     */
    const _initFunctions = {
        setFileService: function () {
            const {size, allowext} = this.options;
            return this.fileService = fileService({size, allowext});
        },
        setControl: function ({next}) {
            const { selector } = this.options;
            if (!selector) { console.warn(`Selector is blank. (${selector})`); {return next = false;}}
            var uploadControlSelector = document.querySelector(selector);
            if (isNull(uploadControlSelector)) { console.warn(`Element is not exist. (${selector})`); return next = fasle; }
            return this.control = uploadControlSelector;
        },
        setButtonArea: function ({next}) {
            if (isNull(this.control)) return next = false;

            return this.buttonArea = createElement({
                parent: this.control,
                style: {
                    width: '100%',
                    border: '1px solid #CCCCCC',
                    padding: '11px',
                    textAlign: 'center',
                    marginBottom: '3px',
                },
                html: '<span><openfiledialog></openfiledialog> 에서 첨부 하거나, 파일을 끌어오세요.</span>',
            }),
            createElement({
                parent: this.buttonArea,
                tags: {
                    openfiledialog: createElement({
                        nodeName: 'a',
                        text: '내 PC',
                        style: {
                            color: 'blue',
                        },
                        attr: {
                            id: 'openfiledialog',
                            href: '#/local'
                        },
                        event: {
                            click: (function (e) {
                                e.preventDefault();
                                var fileControl = this.inputFile;
                                fileControl && fileControl.click();
                            }).bind(this)
                        }
                    })
                }
            });
        },
        setFileListElement: function ({next}) {
            if (isNull(this.control)) return next = false;

            return this.fileList = createElement({
                parent: this.control,
                style: {
                    width: '100%',
                    height: '100px',
                    border: '1px solid #CCCCCC',
                    marginBottom: '3px',
                    overflowY: 'auto',
                }
            });
        },
        setSavedFiles: function () {
            if (this.options.savedList.length > 0) this.append(this.options.savedList)
            return !0;
        },
        setInputElement: function ({next}) {
            if (isNull(this.control)) return next = false;

            return this.inputFile = createElement({
                parent: this.control,
                nodeName: 'input',
                attr: {
                    id: 'user_upload',
                    type: 'file',
                    multiple: ''
                },
                style: {
                    top: -9999,
                    left: -9999,
                    position: 'absolute',
                },
                event: {
                    change: (function (e) {
                        var files = e.target.files;
                        files && this.append(Array.from(files));
                        e.target.value = '';
                    }).bind(this)
                },
            });
        },
        setDragEvent: function ({next}) {
            const { eventArea } = this.options;
            if (isNull(this.control)) return next = false;
            if (isNull(this.buttonArea)) return next = false;

            const styleChange = (function (isOver) {
                let overColor = '#3333FF', baseColor = '#CCCCCC';
                style(this.buttonArea, {
                    borderColor: isOver ? overColor : baseColor,
                });
            }).bind(this);

            eventArea && addEvent(this.control, {
                dragover: function (e) {
                    e.preventDefault();
                    styleChange(!0);
                },
                dragleave: function (e) {
                    e.preventDefault();
                    styleChange(!1);
                },
                drop: (function (e) {
                    e.preventDefault();
                    let files = e.dataTransfer.files;
                    files && this.append(Array.from(files));
                    styleChange(!1);
                }).bind(this),
            });
            return !0;
        },
    }
    
    /**
     * {next}
     * run sequentially
     */
    const _appendFunctions = {
        addFiles : function ({files}) {
            return this.fileService.add(files), !0; 
        },
        display4Edit: function ({files}) {
            const getHtml = file => `<input type="checkbox" value="${file.key}" /> ${file.name} : ${size2byte(file.size)} <removeimage />`;

            for (let i = 0; files.length > i; i++) {
                let file = files[i];
                createElement({
                    parent: createElement({
                        parent: this.fileList,
                        attr: {id: 'id.' + file.key},
                        style: {margin: '2px'},
                        nodeName: 'div',
                        html: getHtml(file)
                    }),
                    tags: {
                        removeimage: createElement({
                            nodeName: 'a',
                            text: 'remove',
                            style: {color: 'blue',},
                            attr: {
                                id: 'remove.' + file.key,
                                href: '#/local'
                            },
                            event: {
                                click: (function (e) {
                                    e.preventDefault();
                                    this.remove([file.key]);
                                }).bind(this)
                            }
                        })
                    }
                });

                if (file.where == 'onserver') {
                    createElement({
                        parent: this.fileList,
                        nodeName: 'input',
                        attr:{
                            type: 'checkbox',
                            id: 'detach.' + file.key,
                            name: '%%Detach',
                            value: file.name,
                        },
                        style: {
                            display: 'none',
                        },
                    });
                }
            }
            return !0;
        },
        display4Read: function ({files}) {
            const gethtml = file => `${file.name} : ${size2byte(file.size)}`;
            for (let i = 0; files.length > i; i++) {
                createElement({
                    parent: createElement({
                        parent: this.fileList,
                        attr: {id: 'id.' + files[i].key},
                        style: {margin: '2px'},
                        nodeName: 'div'
                    }),
                    nodeName: 'a',
                    html: gethtml(files[i]),
                    attr: {
                        download: '',
                        href: this.options.downloadUrl + files[i].name
                    },
                });
            }
            return !0;
        }
    };

    /**
     * must return value (true, false or any values)
     * run sequentially
     */
    const _removeFunctions = {
        removeFileRepo: function ({keys}) { this.fileService.remove(keys); return !0; },
        cleanDisplay: function ({keys}) {
            const $this = this;
            keys.forEach(key => {
                let el = $this.fileList.querySelector(selectParser('#id.' + key));
                el && el.remove();
                
                let detach = $this.fileList.querySelector(selectParser('#detach.' + key));
                detach && detach.setAttribute('checked', true);
            });
            return !0;
        },
    };


    /**
     * 
     * upload Functions
     * 
     */
    const _uploadFunction = {
        promise: function () {
            return {promise: new Promise(function () {})};
        },
        check: function ({promise, next}) {
            if (this.fileService.getLength() == 0) return next = false, promise;
        },
        async upload ({userData}) {
            let data = new FormData();
            this.fileService.getLocalFiles().forEach((file, i) => data.append(`%%File.${i}`, file));
            isJSON(userData) && Object.keys(userData).forEach(d => data.append(d, userData[d]));
            data.append('__Click', '0');

            return await fetch(this.options.uploadUrl, {
                method: 'POST',
                body: data
            }).then(function (response) {
                return response.text();
            }).then(function (text) {
                return text;
            });
        }
    };


    /**
     * 
     * sort Functions
     * 
     */
    const initFunctions4Edit = function () {
        return {
            setFileService,
            setSavedFiles,
            setControl,
            setButtonArea,
            setFileListElement,
            setInputElement,
            setDragEvent
        } = _initFunctions,
        {
            setFileService,
            setControl,
            setButtonArea,
            setFileListElement,
            setSavedFiles,
            setInputElement,
            setDragEvent
        };
    } ();

    const initFunctions4Read = function () {
        return {
            setFileService,
            setSavedFiles,
            setControl,
            setFileListElement
        } = _initFunctions,
        {
            setFileService,
            setControl,
            setFileListElement,
            setSavedFiles
        };
    } ();

    const appendFunctions4Edit = function () {
        return {
            addFiles,
            display4Edit
        } = _appendFunctions,
        {
            addFiles,
            display4Edit
        };
    } ();
    const appendFunctions4Read = function () {
        return {
            addFiles,
            display4Read
        } = _appendFunctions,
        {
            addFiles,
            display4Read
        };
    } ();

    /**
     * 
     * main
     * 
     */
    const __fileuploader = function (options) {
        this.options = copy(this.options || {}, __FILE_UPLOAD_DEFAULT_OPTIONS__, options);
        this.init();
    };
    __fileuploader.prototype = {
        init () { runFunctions.apply(this, [this.options.isEditable ? initFunctions4Edit : initFunctions4Read]) },
        append (files) { runFunctions.apply(this, [this.options.isEditable ? appendFunctions4Edit : appendFunctions4Read, {files}]) },
        remove (keys) { runFunctions.apply(this, [_removeFunctions, {keys}]) },
        get length () { return this.fileService.getLength() },
        upload (userData) { return runFunctions.apply(this, [_uploadFunction, {userData}]) }
    };

    return __fileuploader;
});
