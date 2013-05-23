/*
 * Parsley.js allows you to verify your form inputs frontend side, without writing a line of javascript. Or so..
 *
 * Author: Guillaume Potier - @guillaumepotier
*/

!function ($) {

  'use strict';

  /**
  * Validator class stores all constraints functions and associated messages.
  * Provides public interface to add, remove or modify them
  *
  * @class Validator
  * @constructor
  */
  var Validator = function ( options ) {
    /**
    * Error messages
    * 
    * @property messages
    * @type {Object}
    */
    this.messages = {
        defaultMessage: "This value seems to be invalid."
      , type: {
            email:      "This value should be a valid email."
          , url:        "This value should be a valid url."
          , urlstrict:  "This value should be a valid url."
          , number:     "This value should be a valid number."
          , digits:     "This value should be digits."
          , dateIso:    "This value should be a valid date (YYYY-MM-DD)."
          , alphanum:   "This value should be alphanumeric."
          , phone:      "This value should be a valid phone number."
        }
      , notnull:        "This value should not be null."
      , notblank:       "This value should not be blank."
      , required:       "This value is required."
      , regexp:         "This value seems to be invalid."
      , min:            "This value should be greater than %s."
      , max:            "This value should be lower than %s."
      , range:          "This value should be between %s and %s."
      , minlength:      "This value is too short. It should have %s characters or more."
      , maxlength:      "This value is too long. It should have %s characters or less."
      , rangelength:    "This value length is invalid. It should be between %s and %s characters long."
      , mincheck:       "You must select at least %s choices."
      , maxcheck:       "You must select %s choices or less."
      , rangecheck:     "You must select between %s and %s choices."
      , equalto:        "This value should be the same."
    },

    this.init( options );
  };

  Validator.prototype = {

    constructor: Validator

    /**
    * Validator list. Built-in validators functions
    * 
    * @property validators
    * @type {Object}
    */
    , validators: {
      notnull: function ( val ) {
        return val.length > 0;
      }

      , notblank: function ( val ) {
        return null !== val && '' !== val.replace( /^\s+/g, '' ).replace( /\s+$/g, '' );
      }

      // Works on all inputs. val is object for checkboxes
      , required: function ( val ) {

        // for checkboxes and select multiples. Check there is at least one required value
        if ( 'object' === typeof val ) {
          for ( var i in val ) {
            if ( this.required( val[ i ] ) ) {
              return true;
            }
          }

          return false;
        }

        return this.notnull( val ) && this.notblank( val );
      }

      , type: function ( val, type ) {
        var regExp;

        switch ( type ) {
          case 'number':
            regExp = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;
            break;
          case 'digits':
            regExp = /^\d+$/;
            break;
          case 'alphanum':
            regExp = /^\w+$/;
            break;
          case 'email':
            regExp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
            break;
          case 'url':
            val = new RegExp( '(https?|s?ftp|git)', 'i' ).test( val ) ? val : 'http://' + val;
            /* falls through */
          case 'urlstrict':
            regExp = /^(https?|s?ftp|git):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
            break;
          case 'dateIso':
            regExp = /^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])$/;
            break;
          case 'phone':
            regExp = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
            break;
          default:
            return false;
        }

        // test regExp if not null
        return '' !== val ? regExp.test( val ) : false;
      }

      , regexp: function ( val, regExp, self ) {
        return new RegExp( regExp, self.options.regexpFlag || '' ).test( val );
      }

      , minlength: function ( val, min ) {
        return val.length >= min;
      }

      , maxlength: function ( val, max ) {
        return val.length <= max;
      }

      , rangelength: function ( val, arrayRange ) {
        return this.minlength( val, arrayRange[ 0 ] ) && this.maxlength( val, arrayRange[ 1 ] );
      }

      , min: function ( val, min ) {
        return Number( val ) >= min;
      }

      , max: function ( val, max ) {
        return Number( val ) <= max;
      }

      , range: function ( val, arrayRange ) {
        return val >= arrayRange[ 0 ] && val <= arrayRange[ 1 ];
      }

      , equalto: function ( val, elem, self ) {
        self.options.validateIfUnchanged = true;

        return val === $( elem ).val();
      }

      , remote: function ( val, url, self ) {
        var result = null
          , data = {}
          , dataType = {};

        data[ self.$element.attr( 'name' ) ] = val;

        if ( 'undefined' !== typeof self.options.remoteDatatype ) {
          dataType = { dataType: self.options.remoteDatatype };
        }

        var manage = function ( isConstraintValid, message ) {
          // remove error message if we got a server message, different from previous message
          if ( 'undefined' !== typeof message && 'undefined' !== typeof self.Validator.messages.remote && message !== self.Validator.messages.remote ) {
            $( self.ulError + ' .remote' ).remove();
          }

          self.updtConstraint( { name: 'remote', valid: isConstraintValid }, message );
          self.manageValidationResult();
        };

        // transform string response into object
        var handleResponse = function ( response ) {
          if ( 'object' === typeof response ) {
            return response;
          }

          try {
            response = $.parseJSON( response );
          } catch ( err ) {}

          return response;
        }

        var manageErrorMessage = function ( response ) {
          return 'object' === typeof response && null !== response ? ( 'undefined' !== typeof response.error ? response.error : ( 'undefined' !== typeof response.message ? response.message : null ) ) : null;
        }

        $.ajax( $.extend( {}, {
            url: url
          , data: data
          , type: self.options.remoteMethod || 'GET'
          , success: function ( response ) {
            response = handleResponse( response );
            manage( 1 === response || true === response || ( 'object' === typeof response && null !== response && 'undefined' !== typeof response.success ), manageErrorMessage( response )
            );
          }
          , error: function ( response ) {
            response = handleResponse( response );
            manage( false, manageErrorMessage( response ) );
          }
        }, dataType ) );

        return result;
      }

      /**
      * Aliases for checkboxes constraints
      */
      , mincheck: function ( obj, val ) {
        return this.minlength( obj, val );
      }

      , maxcheck: function ( obj, val ) {
        return this.maxlength( obj, val);
      }

      , rangecheck: function ( obj, arrayRange ) {
        return this.rangelength( obj, arrayRange );
      }
    }

    /*
    * Register custom validators and messages
    */
    , init: function ( options ) {
      var customValidators = options.validators
        , customMessages = options.messages;

      var key;
      for ( key in customValidators ) {
        this.addValidator(key, customValidators[ key ]);
      }

      for ( key in customMessages ) {
        this.addMessage(key, customMessages[ key ]);
      }
    }

    /**
    * Replace %s placeholders by values
    *
    * @method formatMesssage
    * @param {String} message Message key
    * @param {Mixed} args Args passed by validators functions. Could be string, number or object
    * @return {String} Formatted string
    */
    , formatMesssage: function ( message, args ) {

      if ( 'object' === typeof args ) {
        for ( var i in args ) {
          message = this.formatMesssage( message, args[ i ] );
        }

        return message;
      }

      return 'string' === typeof message ? message.replace( new RegExp( '%s', 'i' ), args ) : '';
    }

    /**
    * Add / override a validator in validators list
    *
    * @method addValidator
    * @param {String} name Validator name. Will automatically bindable through data-name=''
    * @param {Function} fn Validator function. Must return {Boolean}
    */
    , addValidator: function ( name, fn ) {
      this.validators[ name ] = fn;
    }

    /**
    * Add / override error message
    *
    * @method addMessage
    * @param {String} name Message name. Will automatically be binded to validator with same name
    * @param {String} message Message
    */
    , addMessage: function ( key, message, type ) {

      if ( 'undefined' !== typeof type && true === type ) {
        this.messages.type[ key ] = message;
        return;
      }

      // custom types messages are a bit tricky cuz' nested ;)
      if ( 'type' === key ) {
        for ( var i in message ) {
          this.messages.type[ i ] = message[ i ];
        }

        return;
      }

      this.messages[ key ] = message;
    }
  };

  /**
  * ParsleyField class manage each form field inside a validated Parsley form.
  * Returns if field valid or not depending on its value and constraints
  * Manage field error display and behavior, event triggers and more
  *
  * @class ParsleyField
  * @constructor
  */
  var ParsleyField = function ( element, options, type ) {
    this.options = options;
    this.Validator = new Validator( options );

    // if type is ParsleyFieldMultiple, just return this. used for clone
    if ( type === 'ParsleyFieldMultiple' ) {
      return this;
    }

    this.init( element, type || 'ParsleyField' );
  };

  ParsleyField.prototype = {

    constructor: ParsleyField

    /**
    * Set some properties, bind constraint validators and validation events
    *
    * @method init
    * @param {Object} element
    * @param {Object} options
    */
    , init: function ( element, type ) {
      this.type = type;
      this.valid = true;
      this.element = element;
      this.validatedOnce = false;
      this.$element = $( element );
      this.val = this.$element.val();
      this.isRequired = false;
      this.constraints = {};

      // overriden by ParsleyItemMultiple if radio or checkbox input
      if ( 'undefined' === typeof this.isRadioOrCheckbox ) {
        this.isRadioOrCheckbox = false;
        this.hash = this.generateHash();
        this.errorClassHandler = this.options.errors.classHandler( element, this.isRadioOrCheckbox ) || this.$element;
      }

      // error ul dom management done only once at init
      this.ulErrorManagement();

      // bind some html5 properties
      this.bindHtml5Constraints();

      // bind validators to field
      this.addConstraints();

      // bind parsley events if validators have been registered
      if ( this.hasConstraints() ) {
        this.bindValidationEvents();
      }
    }

    , setParent: function ( elem ) {
      this.$parent = $( elem );
    }

    , getParent: function () {
      return this.$parent;
    }

    /**
    * Bind some extra html5 types / validators
    *
    * @private
    * @method bindHtml5Constraints
    */
    , bindHtml5Constraints: function () {
      // add html5 required support + class required support
      if ( this.$element.hasClass( 'required' ) || this.$element.attr( 'required' ) ) {
        this.options.required = true;
      }

      // add html5 supported types & options
      if ( 'undefined' !== typeof this.$element.attr( 'type' ) && new RegExp( this.$element.attr( 'type' ), 'i' ).test( 'email url number range' ) ) {
        this.options.type = this.$element.attr( 'type' );

        // number and range types could have min and/or max values
        if ( new RegExp( this.options.type, 'i' ).test( 'number range' ) ) {
          this.options.type = 'number';

          // double condition to support jQuery and Zepto.. :(
          if ( 'undefined' !== typeof this.$element.attr( 'min' ) && this.$element.attr( 'min' ).length ) {
            this.options.min = this.$element.attr( 'min' );
          }

          if ( 'undefined' !== typeof this.$element.attr( 'max' ) && this.$element.attr( 'max' ).length ) {
            this.options.max = this.$element.attr( 'max' );
          }
        }
      }

      if ( 'string' === typeof this.$element.attr( 'pattern' ) && this.$element.attr( 'pattern' ).length ) {
          this.options.regexp = this.$element.attr( 'pattern' );
      }

    }

    /**
    * Attach field validators functions passed through data-api
    *
    * @private
    * @method addConstraints
    */
    , addConstraints: function () {
      for ( var constraint in this.options ) {
        var addConstraint = {};
        addConstraint[ constraint ] = this.options[ constraint ];
        this.addConstraint( addConstraint, true );
      }
    }

    /**
    * Dynamically add a new constraint to a field
    *
    * @method addConstraint
    * @param {Object} constraint { name: requirements }
    */
    , addConstraint: function ( constraint, doNotUpdateValidationEvents ) {
        for ( var name in constraint ) {
          name = name.toLowerCase();

          if ( 'function' === typeof this.Validator.validators[ name ] ) {
            this.constraints[ name ] = {
                name: name
              , requirements: constraint[ name ]
              , valid: null
            }

            if ( name === 'required' ) {
              this.isRequired = true;
            }

            this.addCustomConstraintMessage( name );
          }
        }

        // force field validation next check and reset validation events
        if ( 'undefined' === typeof doNotUpdateValidationEvents ) {
          this.bindValidationEvents();
        }
    }

    /**
    * Dynamically update an existing constraint to a field.
    * Simple API: { name: requirements }
    *
    * @method updtConstraint
    * @param {Object} constraint
    */
    , updateConstraint: function ( constraint, message ) {
      for ( var name in constraint ) {
        this.updtConstraint( { name: name, requirements: constraint[ name ], valid: null }, message );
      }
    }

    /**
    * Dynamically update an existing constraint to a field.
    * Complex API: { name: name, requirements: requirements, valid: boolean }
    *
    * @method updtConstraint
    * @param {Object} constraint
    */
    , updtConstraint: function ( constraint, message ) {
      this.constraints[ constraint.name ] = $.extend( true, this.constraints[ constraint.name ], constraint );

      if ( 'string' === typeof message ) {
        this.Validator.messages[ constraint.name ] = message ;
      }

      // force field validation next check and reset validation events
      this.bindValidationEvents();
    }

    /**
    * Dynamically remove an existing constraint to a field.
    *
    * @method removeConstraint
    * @param {String} constraintName
    */
    , removeConstraint: function ( constraintName ) {
      var constraintName = constraintName.toLowerCase();

      delete this.constraints[ constraintName ];

      if ( constraintName === 'required' ) {
        this.isRequired = false;
      }

      // if there are no more constraint, destroy parsley instance for this field
      if ( !this.hasConstraints() ) {
        // in a form context, remove item from parent
        if ( 'ParsleyForm' === typeof this.getParent() ) {
          this.getParent().removeItem( this.$element );
          return;
        }

        this.destroy();
        return;
      }

      this.bindValidationEvents();
    }

    /**
    * Add custom constraint message, passed through data-API
    *
    * @private
    * @method addCustomConstraintMessage
    * @param constraint
    */
    , addCustomConstraintMessage: function ( constraint ) {
      // custom message type data-type-email-message -> typeEmailMessage | data-minlength-error => minlengthMessage
      var customMessage = constraint
        + ( 'type' === constraint && 'undefined' !== typeof this.options[ constraint ] ? this.options[ constraint ].charAt( 0 ).toUpperCase() + this.options[ constraint ].substr( 1 ) : '' )
        + 'Message';

      if ( 'undefined' !== typeof this.options[ customMessage ] ) {
        this.Validator.addMessage( 'type' === constraint ? this.options[ constraint ] : constraint, this.options[ customMessage ], 'type' === constraint );
      }
    }

    /**
    * Bind validation events on a field
    *
    * @private
    * @method bindValidationEvents
    */
    , bindValidationEvents: function () {
      // this field has validation events, that means it has to be validated
      this.valid = null;
      this.$element.addClass( 'parsley-validated' );

      // remove eventually already binded events
      this.$element.off( '.' + this.type );

      // force add 'change' event if async remote validator here to have result before form submitting
      if ( this.options.remote && !new RegExp( 'change', 'i' ).test( this.options.trigger ) ) {
        this.options.trigger = !this.options.trigger ? 'change' : ' change';
      }

      // alaways bind keyup event, for better UX when a field is invalid
      var triggers = ( !this.options.trigger ? '' : this.options.trigger )
        + ( new RegExp( 'key', 'i' ).test( this.options.trigger ) ? '' : ' keyup' );

      // alaways bind change event, for better UX when a select is invalid
      if ( this.$element.is( 'select' ) ) {
        triggers += new RegExp( 'change', 'i' ).test( triggers ) ? '' : ' change';
      }

      // trim triggers to bind them correctly with .on()
      triggers = triggers.replace( /^\s+/g , '' ).replace( /\s+$/g , '' );

      this.$element.on( ( triggers + ' ' ).split( ' ' ).join( '.' + this.type + ' ' ), false, $.proxy( this.eventValidation, this ) );
    }

    /**
    * Hash management. Used for ul error
    *
    * @method generateHash
    * @returns {String} 5 letters unique hash
    */
    , generateHash: function () {
      return 'parsley-' + ( Math.random() + '' ).substring( 2 );
    }

    /**
    * Public getHash accessor
    *
    * @method getHash
    * @returns {String} hash
    */
    , getHash: function () {
      return this.hash;
    }

    /**
    * Returns field val needed for validation
    * Special treatment for radio & checkboxes
    *
    * @method getVal
    * @returns {String} val
    */
    , getVal: function () {
      return this.$element.val();
    }

    /**
    * Called when validation is triggered by an event
    * Do nothing if val.length < this.options.validationMinlength
    *
    * @method eventValidation
    * @param {Object} event jQuery event
    */
    , eventValidation: function ( event ) {
      var val = this.getVal();

      // do nothing on keypress event if not explicitely passed as data-trigger and if field has not already been validated once
      if ( event.type === 'keyup' && !/keyup/i.test( this.options.trigger ) && !this.validatedOnce ) {
        return true;
      }

      // do nothing on change event if not explicitely passed as data-trigger and if field has not already been validated once
      if ( event.type === 'change' && !/change/i.test( this.options.trigger ) && !this.validatedOnce ) {
        return true;
      }

      // start validation process only if field has enough chars and validation never started
      if ( !this.isRadioOrCheckbox && val.length < this.options.validationMinlength && !this.validatedOnce ) {
        return true;
      }

      this.validate( true );
    }

    /**
    * Return if field verify its constraints
    *
    * @method isValid
    * @return {Boolean} Is field valid or not
    */
    , isValid: function () {
      return this.validate( false );
    }

    /**
    * Return if field has constraints
    *
    * @method hasConstraints
    * @return {Boolean} Is field has constraints or not
    */
    , hasConstraints: function () {
      for ( var constraint in this.constraints ) {
        return true;
      }

      return false;
    }

    /**
    * Validate a field & display errors
    *
    * @method validate
    * @param {Boolean} errorBubbling set to false if you just want valid boolean without error bubbling next to fields
    * @return {Boolean} Is field valid or not
    */
    , validate: function ( errorBubbling ) {
      var val = this.getVal()
        , valid = null;

      // do not even bother trying validating a field w/o constraints
      if ( !this.hasConstraints() ) {
        return null;
      }

      // reset Parsley validation if onFieldValidate returns true, or if field is empty and not required
      if ( this.options.listeners.onFieldValidate( this.element, this ) || ( '' === val && !this.isRequired ) ) {
        this.reset();
        return null;
      }

      // do not validate a field already validated and unchanged !
      if ( !this.needsValidation( val ) ) {
        return this.valid;
      }

      this.errorBubbling = 'undefined' !== typeof errorBubbling ? errorBubbling : true;

      valid = this.applyValidators();

      if ( this.errorBubbling ) {
        this.manageValidationResult();
      }

      return valid;
    }

    /**
    * Check if value has changed since previous validation
    *
    * @method needsValidation
    * @param value
    * @return {Boolean}
    */
    , needsValidation: function ( val ) {
      if ( !this.options.validateIfUnchanged && this.valid !== null && this.val === val && this.validatedOnce ) {
        return false;
      }

      this.val = val;
      return this.validatedOnce = true;
    }

    /**
    * Loop through every fields validators
    * Adds errors after unvalid fields
    *
    * @method applyValidators
    * @return {Mixed} {Boolean} If field valid or not, null if not validated
    */
    , applyValidators: function () {
      var valid = null;

      for ( var constraint in this.constraints ) {
        var result = this.Validator.validators[ this.constraints[ constraint ].name ]( this.val, this.constraints[ constraint ].requirements, this );

        if ( false === result ) {
          valid = false;
          this.constraints[ constraint ].valid = valid;
        } else if ( true === result ) {
          this.constraints[ constraint ].valid = true;
          valid = false !== valid;
        }
      }

      return valid;
    }

    /**
    * Fired when all validators have be executed
    * Returns true or false if field is valid or not
    * Display errors messages below faild fields
    * Adds parsley-success or parsley-error class on fields
    *
    * @method manageValidationResult
    * @return {Boolean} Is field valid or not
    */
    , manageValidationResult: function () {
      var valid = null;

      for ( var constraint in this.constraints ) {
        if ( false === this.constraints[ constraint ].valid ) {
          this.manageError( this.constraints[ constraint ] );
          valid = false;
        } else if ( true === this.constraints[ constraint ].valid ) {
          this.removeError( this.constraints[ constraint ].name );
          valid = false !== valid;
        }
      }

      this.valid = valid;

      if ( true === this.valid ) {
        this.removeErrors();
        this.errorClassHandler.removeClass( this.options.errorClass ).addClass( this.options.successClass );
        this.options.listeners.onFieldSuccess( this.element, this.constraints, this );
        return true;
      } else if ( false === this.valid ) {
        this.errorClassHandler.removeClass( this.options.successClass ).addClass( this.options.errorClass );
        this.options.listeners.onFieldError( this.element, this.constraints, this );
        return false;
      }

      return valid;
    }

    /**
    * Manage ul error Container
    *
    * @private
    * @method ulErrorManagement
    */
    , ulErrorManagement: function () {
      this.ulError = '#' + this.hash;
      this.ulTemplate = $( this.options.errors.errorsWrapper ).attr( 'id', this.hash ).addClass( 'parsley-error-list' );
    }

    /**
    * Remove li / ul error
    *
    * @method removeError
    * @param {String} constraintName Method Name
    */
    , removeError: function ( constraintName ) {
      var liError = this.ulError + ' .' + constraintName;

      this.options.animate ? $( liError ).fadeOut( this.options.animateDuration, function () { $( this ).remove() } ) : $( liError ).remove();

      // remove li error, and ul error if no more li inside
      if ( this.ulError && $( this.ulError ).children().length === 0 ) {
        this.removeErrors();
      }
    }

    /**
    * Add li error
    *
    * @method addError
    * @param {Object} { minlength: "error message for minlength constraint" }
    */
    , addError: function ( error ) {
      for ( var constraint in error ) {
        var liTemplate = $( this.options.errors.errorElem ).addClass( constraint );

        $( this.ulError ).append( this.options.animate ? $( liTemplate ).text( error[ constraint ] ).hide().fadeIn( this.options.animateDuration ) : $( liTemplate ).text( error[ constraint ] ) );
      }
    }

    /**
    * Remove all ul / li errors
    *
    * @method removeErrors
    */
    , removeErrors: function () {
      this.options.animate ? $( this.ulError ).fadeOut( this.options.animateDuration, function () { $( this ).remove(); } ) : $( this.ulError ).remove();
    }

    /**
    * Remove ul errors and parsley error or success classes
    *
    * @method reset
    */
    , reset: function () {
      this.valid = null;
      this.removeErrors();
      this.validatedOnce = false;
      this.errorClassHandler.removeClass( this.options.successClass ).removeClass( this.options.errorClass );

      for ( var constraint in this.constraints ) {
        this.constraints[ constraint ].valid = null;
      }

      return this;
    }

    /**
    * Add li / ul errors messages
    *
    * @method manageError
    * @param {Object} constraint
    */
    , manageError: function ( constraint ) {
      // display ulError container if it has been removed previously (or never shown)
      if ( !$( this.ulError ).length ) {
        this.manageErrorContainer();
      }

      // TODO: refacto properly
      // if required constraint but field is not null, do not display
      if ( 'required' === constraint.name && null !== this.getVal() && this.getVal().length > 0 ) {
        return;
      // if empty required field and non required constraint fails, do not display
      } else if ( this.isRequired && 'required' !== constraint.name && ( null === this.getVal() || 0 === this.getVal().length ) ) {
        return;
      }

      // TODO: refacto error name w/ proper & readable function
      var constraintName = constraint.name
        , liClass = false !== this.options.errorMessage ? 'custom-error-message' : constraintName
        , liError = {}
        , message = false !== this.options.errorMessage ? this.options.errorMessage : ( constraint.name === 'type' ?
            this.Validator.messages[ constraintName ][ constraint.requirements ] : ( 'undefined' === typeof this.Validator.messages[ constraintName ] ?
              this.Validator.messages.defaultMessage : this.Validator.formatMesssage( this.Validator.messages[ constraintName ], constraint.requirements ) ) );

      // add liError if not shown. Do not add more than once custom errorMessage if exist
      if ( !$( this.ulError + ' .' + liClass ).length ) {
        liError[ liClass ] = message;
        this.addError( liError );
      }
    }

    /**
    * Create ul error container
    *
    * @method manageErrorContainer
    */
    , manageErrorContainer: function () {
      var errorContainer = this.options.errorContainer || this.options.errors.container( this.element, this.isRadioOrCheckbox )
        , ulTemplate = this.options.animate ? this.ulTemplate.show() : this.ulTemplate;

      if ( 'undefined' !== typeof errorContainer ) {
        $( errorContainer ).append( ulTemplate );
        return;
      }

      !this.isRadioOrCheckbox ? this.$element.after( ulTemplate ) : this.$element.parent().after( ulTemplate );
    }

    /**
    * Add custom listeners
    *
    * @param {Object} { listener: function () {} }, eg { onFormSubmit: function ( valid, event, focus ) { ... } }
    */
    , addListener: function ( object ) {
      for ( var listener in object ) {
        this.options.listeners[ listener ] = object[ listener ];
      }
    }

    /**
    * Destroy parsley field instance
    *
    * @private
    * @method destroy
    */
    , destroy: function () {
      this.$element.removeClass( 'parsley-validated' );
      this.reset().$element.off( '.' + this.type ).removeData( this.type );
    }
  };

  /**
  * ParsleyFieldMultiple override ParsleyField for checkbox and radio inputs
  * Pseudo-heritance to manage divergent behavior from ParsleyItem in dedicated methods
  *
  * @class ParsleyFieldMultiple
  * @constructor
  */
  var ParsleyFieldMultiple = function ( element, options, type ) {
    this.initMultiple( element, options );
    this.inherit( element, options );
    this.Validator = new Validator( options );

    // call ParsleyField constructor
    this.init( element, type || 'ParsleyFieldMultiple' );
  };

  ParsleyFieldMultiple.prototype = {

    constructor: ParsleyFieldMultiple

    /**
    * Set some specific properties, call some extra methods to manage radio / checkbox
    *
    * @method init
    * @param {Object} element
    * @param {Object} options
    */
    , initMultiple: function ( element, options ) {
      this.element = element;
      this.$element = $( element );
      this.group = options.group || false;
      this.hash = this.getName();
      this.siblings = this.group ? '[data-group="' + this.group + '"]' : 'input[name="' + this.$element.attr( 'name' ) + '"]';
      this.isRadioOrCheckbox = true;
      this.isRadio = this.$element.is( 'input[type=radio]' );
      this.isCheckbox = this.$element.is( 'input[type=checkbox]' );
      this.errorClassHandler = options.errors.classHandler( element, this.isRadioOrCheckbox ) || this.$element.parent();
    }

    /**
    * Set specific constraints messages, do pseudo-heritance
    *
    * @private
    * @method inherit
    * @param {Object} element
    * @param {Object} options
    */
    , inherit: function ( element, options ) {
      var clone = new ParsleyField( element, options, 'ParsleyFieldMultiple' );

      for ( var property in clone ) {
        if ( 'undefined' === typeof this[ property ] ) {
          this[ property ] = clone [ property ];
        }
      }
    }

    /**
    * Set specific constraints messages, do pseudo-heritance
    *
    * @method getName
    * @returns {String} radio / checkbox hash is cleaned 'name' or data-group property
    */
   , getName: function () {
     if ( this.group ) {
       return 'parsley-' + this.group;
     }

     if ( 'undefined' === typeof this.$element.attr( 'name' ) ) {
       throw "A radio / checkbox input must have a data-group attribute or a name to be Parsley validated !";
     }

     return 'parsley-' + this.$element.attr( 'name' ).replace( /(:|\.|\[|\])/g, '' );
   }

   /**
   * Special treatment for radio & checkboxes
   * Returns checked radio or checkboxes values
   *
   * @method getVal
   * @returns {String} val
   */
   , getVal: function () {
      if ( this.isRadio ) {
        return $( this.siblings + ':checked' ).val() || '';
      }

      if ( this.isCheckbox ) {
        var values = [];

        $( this.siblings + ':checked' ).each( function () {
          values.push( $( this ).val() );
        } );

        return values;
      }
   }

   /**
   * Bind validation events on a field
   *
   * @private
   * @method bindValidationEvents
   */
   , bindValidationEvents: function () {
     // this field has validation events, that means it has to be validated
     this.valid = null;
     this.$element.addClass( 'parsley-validated' );

     // remove eventually already binded events
     this.$element.off( '.' + this.type );

      // alaways bind keyup event, for better UX when a field is invalid
      var self = this
        , triggers = ( !this.options.trigger ? '' : this.options.trigger )
        + ( new RegExp( 'change', 'i' ).test( this.options.trigger ) ? '' : ' change' );

      // trim triggers to bind them correctly with .on()
      triggers = triggers.replace( /^\s+/g , '' ).replace( /\s+$/g ,'' );

     // bind trigger event on every siblings
     $( this.siblings ).each(function () {
       $( this ).on( triggers.split( ' ' ).join( '.' + self.type + ' ' ) , false, $.proxy( self.eventValidation, self ) );
     } )
   }
  };

  /**
  * ParsleyForm class manage Parsley validated form.
  * Manage its fields and global validation
  *
  * @class ParsleyForm
  * @constructor
  */
  var ParsleyForm = function ( element, options, type ) {
    this.init( element, options, type || 'parsleyForm' );
  };

  ParsleyForm.prototype = {

    constructor: ParsleyForm

    /* init data, bind jQuery on() actions */
    , init: function ( element, options, type ) {
      this.type = type;
      this.items = [];
      this.$element = $( element );
      this.options = options;
      var self = this;

      this.$element.find( options.inputs ).each( function () {
        self.addItem( this );
      });

      this.$element.on( 'submit.' + this.type , false, $.proxy( this.validate, this ) );
    }

    /**
    * Add custom listeners
    *
    * @param {Object} { listener: function () {} }, eg { onFormSubmit: function ( valid, event, focus ) { ... } }
    */
    , addListener: function ( object ) {
      for ( var listener in object ) {
        if ( new RegExp( 'Field' ).test( listener ) ) {
          for ( var item = 0; item < this.items.length; item++ ) {
            this.items[ item ].addListener( object );
          }
        } else {
          this.options.listeners[ listener ] = object[ listener ];
        }
      }
    }

    /**
    * Adds a new parsleyItem child to ParsleyForm
    *
    * @method addItem
    * @param elem
    */
    , addItem: function ( elem ) {
      if ( $( elem ).is( this.options.excluded ) ) {
        return false;
      }

      var ParsleyField = $( elem ).parsley( this.options );
      ParsleyField.setParent( this );

      this.items.push( ParsleyField );
    }

    /**
    * Removes a parsleyItem child from ParsleyForm
    *
    * @method removeItem
    * @param elem
    * @return {Boolean}
    */
    , removeItem: function ( elem ) {
      var parsleyItem = $( elem ).parsley();

      // identify & remove item if same Parsley hash
      for ( var i = 0; i < this.items.length; i++ ) {
        if ( this.items[ i ].hash === parsleyItem.hash ) {
          this.items[ i ].destroy();
          this.items.splice( i, 1 );
          return true;
        }
      }

      return false;
    }

    /**
    * Process each form field validation
    * Display errors, call custom onFormSubmit() function
    *
    * @method validate
    * @param {Object} event jQuery Event
    * @return {Boolean} Is form valid or not
    */
    , validate: function ( event ) {
      var valid = true;
      this.focusedField = false;

      for ( var item = 0; item < this.items.length; item++ ) {
        if ( 'undefined' !== typeof this.items[ item ] && false === this.items[ item ].validate() ) {
          valid = false;

          if ( !this.focusedField && 'first' === this.options.focus || 'last' === this.options.focus ) {
            this.focusedField = this.items[ item ].$element;
          }
        }
      }

      // form is invalid, focus an error field depending on focus policy
      if ( this.focusedField && !valid ) {
        this.focusedField.focus();
      }

      this.options.listeners.onFormSubmit( valid, event, this );

      return valid;
    }

    , isValid: function () {
      for ( var item = 0; item < this.items.length; item++ ) {
        if ( false === this.items[ item ].isValid() ) {
          return false;
        }
      }

      return true;
    }

    /**
    * Remove all errors ul under invalid fields
    *
    * @method removeErrors
    */
    , removeErrors: function () {
      for ( var item = 0; item < this.items.length; item++ ) {
        this.items[ item ].parsley( 'reset' );
      }
    }

    /**
    * destroy Parsley binded on the form and its fields
    *
    * @method destroy
    */
    , destroy: function () {
      for ( var item = 0; item < this.items.length; item++ ) {
        this.items[ item ].destroy();
      }

      this.$element.off( '.' + this.type ).removeData( this.type );
    }
    
    /**
    * reset Parsley binded on the form and its fields
    *
    * @method reset
    */
    , reset: function () {
      for ( var item = 0; item < this.items.length; item++ ) {
        this.items[ item ].reset();
      }
    }
  };

  /**
  * Parsley plugin definition
  * Provides an interface to access public Validator, ParsleyForm and ParsleyField functions
  *
  * @class Parsley
  * @constructor
  * @param {Mixed} Options. {Object} to configure Parsley or {String} method name to call a public class method
  * @param {Function} Callback function
  * @return {Mixed} public class method return
  */
  $.fn.parsley = function ( option, fn ) {
    var options = $.extend( true, {}, $.fn.parsley.defaults, 'undefined' !== typeof window.ParsleyConfig ? window.ParsleyConfig : {}, option, this.data() )
      , newInstance = null;

    function bind ( self, type ) {
      var parsleyInstance = $( self ).data( type );

      // if data never binded or we want to clone a build (for radio & checkboxes), bind it right now!
      if ( !parsleyInstance ) {
        switch ( type ) {
          case 'parsleyForm':
            parsleyInstance = new ParsleyForm( self, options, 'parsleyForm' );
            break;
          case 'parsleyField':
            parsleyInstance = new ParsleyField( self, options, 'parsleyField' );
            break;
          case 'parsleyFieldMultiple':
            parsleyInstance = new ParsleyFieldMultiple( self, options, 'parsleyFieldMultiple' );
            break;
          default:
            return;
        }

        $( self ).data( type, parsleyInstance );
      }

      // here is our parsley public function accessor
      if ( 'string' === typeof option && 'function' === typeof parsleyInstance[ option ] ) {
        var response = parsleyInstance[ option ]( fn );

        return 'undefined' !== typeof response ? response : $( self );
      }

      return parsleyInstance;
    }

    // if a form elem is given, bind all its input children
    if ( $( this ).is( 'form' ) ) {
      newInstance = bind ( $( this ), 'parsleyForm' );

    // if it is a Parsley supported single element, bind it too, except inputs type hidden
    // add here a return instance, cuz' we could call public methods on single elems with data[ option ]() above
    } else if ( $( this ).is( options.inputs ) && !$( this ).is( options.excluded ) ) {
      newInstance = bind( $( this ), !$( this ).is( 'input[type=radio], input[type=checkbox]' ) ? 'parsleyField' : 'parsleyFieldMultiple' );
    }

    return 'function' === typeof fn ? fn() : newInstance;
  };

  $.fn.parsley.Constructor = ParsleyForm;

  /**
  * Parsley plugin configuration
  * 
  * @property $.fn.parsley.defaults
  * @type {Object}
  */
  $.fn.parsley.defaults = {
    // basic data-api overridable properties here..
    inputs: 'input, textarea, select'           // Default supported inputs.
    , excluded: 'input[type=hidden], :disabled' // Do not validate input[type=hidden] & :disabled.
    , trigger: false                            // $.Event() that will trigger validation. eg: keyup, change..
    , animate: true                             // fade in / fade out error messages
    , animateDuration: 300                      // fadein/fadout ms time
    , focus: 'first'                            // 'fist'|'last'|'none' which error field would have focus first on form validation
    , validationMinlength: 3                    // If trigger validation specified, only if value.length > validationMinlength
    , successClass: 'parsley-success'           // Class name on each valid input
    , errorClass: 'parsley-error'               // Class name on each invalid input
    , errorMessage: false                       // Customize an unique error message showed if one constraint fails
    , validators: {}                            // Add your custom validators functions
    , messages: {}                              // Add your own error messages here

    //some quite advanced configuration here..
    , validateIfUnchanged: false                                          // false: validate once by field value change
    , errors: {
        classHandler: function ( elem, isRadioOrCheckbox ) {}             // specify where parsley error-success classes are set
      , container: function ( elem, isRadioOrCheckbox ) {}                // specify an elem where errors will be **apened**
      , errorsWrapper: '<ul></ul>'                                        // do not set an id for this elem, it would have an auto-generated id
      , errorElem: '<li></li>'                                            // each field constraint fail in an li
      }
    , listeners: {
        onFieldValidate: function ( elem, ParsleyForm ) { return false; } // Executed on validation. Return true to ignore field validation
      , onFormSubmit: function ( isFormValid, event, ParsleyForm ) {}     // Executed once on form validation
      , onFieldError: function ( elem, constraints, ParsleyField ) {}     // Executed when a field is detected as invalid
      , onFieldSuccess: function ( elem, constraints, ParsleyField ) {}   // Executed when a field passes validation
    }
  };

  /* PARSLEY auto-bind DATA-API + Global config retrieving
  * =================================================== */
  $( window ).on( 'load', function () {
    $( '[data-validate="parsley"]' ).each( function () {
      $( this ).parsley();
    } );
  } );

// This plugin works with jQuery or Zepto (with data extension built for Zepto.)
}(window.jQuery || window.Zepto);

window.ParsleyConfig = window.ParsleyConfig || {};

(function ($) {
  window.ParsleyConfig = $.extend( true, {}, window.ParsleyConfig, {
    validators: {
      minwords: function ( val, nbWords ) {
        val = val.replace( /(^\s*)|(\s*$)/gi, "" );
        val = val.replace( /[ ]{2,}/gi, " " );
        val = val.replace( /\n /, "\n" );
        val = val.split(' ').length;

        return val >= nbWords;
      }

      , maxwords : function ( val, nbWords ) {
        val = val.replace( /(^\s*)|(\s*$)/gi, "" );
        val = val.replace( /[ ]{2,}/gi, " " );
        val = val.replace( /\n /, "\n" );
        val = val.split(' ').length;

        return val <= nbWords;
      }

      , rangewords: function ( val, obj ) {
        val = val.replace( /(^\s*)|(\s*$)/gi, "" );
        val = val.replace( /[ ]{2,}/gi, " " );
        val = val.replace( /\n /, "\n" );
        val = val.split(' ').length;

        return val >= obj[0] && val <= obj[1];
      }

      , greaterthan: function ( val, elem, self ) {
        self.options.validateIfUnchanged = true;

        return new Number(val) > new Number($( elem ).val());
      }

      , lessthan: function ( val, elem, self ) {
        self.options.validateIfUnchanged = true;

        return new Number(val) < new Number($( elem ).val());
      }

      , beforedate: function ( val, elem, self) {
        return Date.parse(val) < Date.parse($(elem).val());
      }

      , afterdate: function ( val, elem, self) {
        return Date.parse($(elem).val()) < Date.parse(val);
      }

      , inlist: function ( val, list, self ) {
        var delimiter = self.options.inlistDelimiter || ',';
        var listItems = (list + "").split(new RegExp("\\s*\\" + delimiter + "\\s*"));

        return (listItems.indexOf(val.trim()) !== -1);
      }

      , luhn: function ( val, elem, self) {
        val = val.replace(/[ -]/g, '');
        var digit, n, sum, _j, _len1, _ref2;
        sum = 0;
        _ref2 = val.split('').reverse();
        for (n = _j = 0, _len1 = _ref2.length; _j < _len1; n = ++_j) {
          digit = _ref2[n];
          digit = +digit;
          if (n % 2) {
            digit *= 2;
            if (digit < 10) {
              sum += digit;
            } else {
              sum += digit - 9;
            }
          } else {
            sum += digit;
          }
        }
        return sum % 10 === 0;
      }
    }
    , messages: {
        minwords:       "This value should have %s words at least."
      , maxwords:       "This value should have %s words maximum."
      , rangewords:     "This value should have between %s and %s words."
      , greaterthan:    "This value should be greater than %s."
      , lessthan:       "This value should be less than %s."
      , beforedate:     "This date should be before %s."
      , afterdate:      "This date should be after %s."
      , luhn:           "This value should pass the luhn test."
    }
  });
}(window.jQuery || window.Zepto));

/* 
 * The MIT License
 *
 * Copyright (c) 2012 James Allardice
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * -----------------------------------------------------------------------------------------------------------------------------------------------------
 *
 * Placeholders is a simple polyfill for the HTML5 "placeholder" attribute. The placeholder attribute can be used on input elements of certain types
 * and provides a short hint (such as a sample value or a brief description) intended to aid the user with data entry. This polyfill has been tested
 * and functions correctly in Internet Explorer 6 and above, Firefox 3.6 and above, Safari 3.2 and above, Opera 9 and above and Chrome 16 and above.
 * The script will be tested in further browsers in due course and the above list edited accordingly.
 *
 * User agents should display the value of the placeholder attribute when the element's value is the empty string and the element does not
 * have focus. The user agents that have implemented support for this attribute all display the placeholder inside the element, as if it were
 * the element's value, in a light grey colour to differentiate between placeholder text and value text.
 *
 * The Placeholders polyfill attempts to replicate the functionality of compliant user agents so that non-compliant user agents will still function
 * as expected when faced with a "placeholder" attribute.
 * 
 * The script is unobtrusive and will only apply if the placeholder attribute is not supported by the user agent in which it is running. To use a placeholder
 * simply add the "placeholder" attribute to a supporting input element:
 *
 * <input type="text" placeholder="Placeholder text">
 *
 * To get this placeholder to function in non-supporting user agents simply call the init method when appropriate (the DOM must be ready for manipulation,
 * unless the `live` option is true):
 *
 * Placeholders.init();
 *
 * The init method accepts one argument, `options`. It's an object that contains settings to control the behaviour of the polyfill. Currently, only 2 options
 * are available:
 *
 * `live` - If truthy, the polyfill will apply to all supported input elements now and in the future, and dynamic
 * changes to the placeholder attribute value will be reflected. If falsy, the polyfill will only apply to those elements with a placeholder attribute
 * value in the DOM at the time the method is executed. If the live option is not used, the placeholders can be refreshed manually by calling `Placeholders.refresh()`. 
 *
 * `hideOnFocus` - If truthy, the placeholder text will not disappear when the field receives focus. This option is relatively new to the spec, but is
 * starting to be implemented in browsers (e.g. Safari, and now Chrome). This option is set to `true` by default, since that's where browsers seem to be heading.
 */

/*jslint browser: true */

var Placeholders = (function () {

	"use strict";

	/* List of input types that support the placeholder attribute. We only want to modify input elements with one of these types.
	 * WARNING: If an input type is not supported by a browser, the browser will choose the default type (text) and the placeholder shim will 
	 * apply */
	var validTypes = [
			"text",
			"search",
			"url",
			"tel",
			"email",
			"password",
			"number",
			"textarea"
		],

	//Default options, can be overridden by passing object to `init`
		settings = {
			live:           false,
			hideOnFocus:    false,
			className:      'placeholderspolyfill', // placeholder class name to apply to form fields
			textColor:      '#999',                 // default placeholder text color
			styleImportant: true                    // add !important flag to placeholder style
		},

	//Keycodes that are not allowed when the placeholder is visible and `hideOnFocus` is `false`
		badKeys = [37, 38, 39, 40],

	//Used if `live` options is `true`
		interval,

	//Stores the input value on keydown (used when `hideOnFocus` option is `false`)
		valueKeyDown,

	// polyfill class name regexp
		classNameRegExp = new RegExp('\\b' + settings.className + '\\b');

	// The cursorToStart function attempts to jump the cursor to before the first character of input
	function cursorToStart(elem) {
		var range;
		if (elem.createTextRange) {
			range = elem.createTextRange();
			range.move("character", 0);
			range.select();
		} else if (elem.selectionStart) {
			elem.focus();
			elem.setSelectionRange(0, 0);
		}
	}

	/* The focusHandler function is executed when input elements with placeholder attributes receive a focus event. If necessary, the placeholder
	 * and its associated styles are removed from the element. Must be bound to an element. */
	function focusHandler() {

		var type;

		//If the placeholder is currently visible, remove it and its associated styles
		if (this.value === this.getAttribute("placeholder")) {

			if (!settings.hideOnFocus) {
				cursorToStart(this);
			} else {
				/* Remove the placeholder class name. Use a regular expression to ensure the string being searched for is a complete word, and not part of a longer
				 * string, on the off-chance a class name including that string also exists on the element */
				this.className = this.className.replace(classNameRegExp, "");
				this.value = "";

				// Check if we need to switch the input type (this is the case if it's a password input)
				type = this.getAttribute("data-placeholdertype");
				if (type) {
					this.type = type;
				}
			}
		}
	}

	/* The blurHandler function is executed when input elements with placeholder attributes receive a blur event. If necessary, the placeholder
	 * and its associated styles are applied to the element. Must be bound to an element. */
	function blurHandler() {

		var type;

		//If the input value is the empty string, apply the placeholder and its associated styles
		if (this.value === "") {
			this.className = this.className + " " + settings.className;
			this.value = this.getAttribute("placeholder");

			// Check if we need to switch the input type (this is the case if it's a password input)
			type = this.getAttribute("data-placeholdertype");
			if (type) {
				this.type = "text";
			}
		}
	}

	/* The submitHandler function is executed when the containing form, if any, of a given input element is submitted. If necessary, placeholders on any
	 * input element descendants of the form are removed so that the placeholder value is not submitted as the element value. */
	function submitHandler() {
		var inputs = this.getElementsByTagName("input"),
			textareas = this.getElementsByTagName("textarea"),
			numInputs = inputs.length,
			num = numInputs + textareas.length,
			element,
			placeholder,
			i;
		//Iterate over all descendant input elements and remove placeholder if necessary
		for (i = 0; i < num; i += 1) {
			element = (i < numInputs) ? inputs[i] : textareas[i - numInputs];
			placeholder = element.getAttribute("placeholder");

			//If the value of the input is equal to the value of the placeholder attribute we need to clear the value
			if (element.value === placeholder) {
				element.value = "";
			}
		}
	}

	/* The keydownHandler function is executed when the input elements with placeholder attributes receive a keydown event. It simply stores the current
	 * value of the input (so we can kind-of simulate the poorly-supported `input` event). Used when `hideOnFocus` option is `false`. Must be bound to an element. */
	function keydownHandler(event) {
		valueKeyDown = this.value;

		//Prevent the use of the arrow keys (try to keep the cursor before the placeholder)
		return !(valueKeyDown === this.getAttribute("placeholder") && badKeys.indexOf(event.keyCode) > -1);
	}

	/* The keyupHandler function is executed when the input elements with placeholder attributes receive a keyup event. It kind-of simulates the native but
	 * poorly-supported `input` event by checking if the key press has changed the value of the element. Used when `hideOnFocus` option is `false`. Must be bound to an element. */
	function keyupHandler() {

		var type;

		if (this.value !== valueKeyDown) {

			// Remove the placeholder
			this.className = this.className.replace(classNameRegExp, "");
			this.value = this.value.replace(this.getAttribute("placeholder"), "");

			// Check if we need to switch the input type (this is the case if it's a password input)
			type = this.getAttribute("data-placeholdertype");
			if (type) {
				this.type = type;
			}
		}
		if (this.value === "") {

			blurHandler.call(this);
			cursorToStart(this);
		}
	}

	//The addEventListener function binds an event handler with the context of an element to a specific event on that element. Handles old-IE and modern browsers.
	function addEventListener(element, event, fn) {
		if (element.addEventListener) {
			return element.addEventListener(event, fn.bind(element), false);
		}
		if (element.attachEvent) {
			return element.attachEvent("on" + event, fn.bind(element));
		}
	}

	//The addEventListeners function binds the appropriate (depending on options) event listeners to the specified input or textarea element.
	function addEventListeners(element) {
		if (!settings.hideOnFocus) {
			addEventListener(element, "keydown", keydownHandler);
			addEventListener(element, "keyup", keyupHandler);
		}
		addEventListener(element, "focus", focusHandler);
		addEventListener(element, "blur", blurHandler);
	}

	/* The updatePlaceholders function checks all input and textarea elements and updates the placeholder if necessary. Elements that have been added to the DOM since the call to 
	 * createPlaceholders will not function correctly until this function is executed. The same goes for any existing elements whose placeholder property has been changed (via 
	 * element.setAttribute("placeholder", "new") for example) */
	function updatePlaceholders() {

		//Declare variables, get references to all input and textarea elements
		var inputs = document.getElementsByTagName("input"),
			textareas = document.getElementsByTagName("textarea"),
			numInputs = inputs.length,
			num = numInputs + textareas.length,
			i,
            form,
			element,
			oldPlaceholder,
			newPlaceholder;

		//Iterate over all input and textarea elements and apply/update the placeholder polyfill if necessary
		for (i = 0; i < num; i += 1) {

			//Get the next element from either the input NodeList or the textarea NodeList, depending on how many elements we've already looped through
			element = (i < numInputs) ? inputs[i] : textareas[i - numInputs];

			//Get the value of the placeholder attribute
			newPlaceholder = element.getAttribute("placeholder");

			//Check whether the current input element is of a type that supports the placeholder attribute
			if (validTypes.indexOf(element.type) > -1) {

				//The input type does support the placeholder attribute. Check whether the placeholder attribute has a value
				if (newPlaceholder) {

					//The placeholder attribute has a value. Get the value of the current placeholder data-* attribute
					oldPlaceholder = element.getAttribute("data-currentplaceholder");

					//Check whether the placeholder attribute value has changed
					if (newPlaceholder !== oldPlaceholder) {

						//The placeholder attribute value has changed so we need to update. Check whether the placeholder should currently be visible.
						if (element.value === oldPlaceholder || element.value === newPlaceholder || !element.value) {

							//The placeholder should be visible so change the element value to that of the placeholder attribute and set placeholder styles
							element.value = newPlaceholder;
							element.className = element.className + " " + settings.className;
						}

						//If the current placeholder data-* attribute has no value the element wasn't present in the DOM when event handlers were bound, so bind them now
						if (!oldPlaceholder) {
                            //If the element has a containing form bind to the submit event so we can prevent placeholder values being submitted as actual values
                            if (element.form) {

                                //Get a reference to the containing form element (if present)
                                form = element.form;

                                //The placeholdersubmit data-* attribute is set if this form has already been dealt with
                                if (!form.getAttribute("data-placeholdersubmit")) {

                                    //The placeholdersubmit attribute wasn't set, so attach a submit event handler
                                    addEventListener(form, "submit", submitHandler);

                                    //Set the placeholdersubmit attribute so we don't repeatedly bind event handlers to this form element
                                    form.setAttribute("data-placeholdersubmit", "true");
                                }
                            }
							addEventListeners(element);
						}

						//Update the value of the current placeholder data-* attribute to reflect the new placeholder value
						element.setAttribute("data-currentplaceholder", newPlaceholder);
					}
				}
			}
		}
	}

	/* The createPlaceholders function checks all input and textarea elements currently in the DOM for the placeholder attribute. If the attribute
	 * is present, and the element is of a type (e.g. text) that allows the placeholder attribute, it attaches the appropriate event listeners
	 * to the element and if necessary sets its value to that of the placeholder attribute */
	function createPlaceholders() {

		//Declare variables and get references to all input and textarea elements
		var inputs = document.getElementsByTagName("input"),
			textareas = document.getElementsByTagName("textarea"),
			numInputs = inputs.length,
			num = numInputs + textareas.length,
			i,
			element,
			form,
			placeholder;

		//Iterate over all input elements and apply placeholder polyfill if necessary
		for (i = 0; i < num; i += 1) {

			//Get the next element from either the input NodeList or the textarea NodeList, depending on how many elements we've already looped through
			element = (i < numInputs) ? inputs[i] : textareas[i - numInputs];

			//Get the value of the placeholder attribute
			placeholder = element.getAttribute("placeholder");

			//Check whether or not the current element is of a type that allows the placeholder attribute
			if (validTypes.indexOf(element.type) > -1) {

				//The input type does support placeholders. Check that the placeholder attribute has been given a value
				if (placeholder) {

					// If the element type is "password", attempt to change it to "text" so we can display the placeholder value in plain text
					if (element.type === "password") {

						// The `type` property is read-only in IE < 9, so in those cases we just move on. The placeholder will be displayed masked
						try {
							element.type = "text";
							element.setAttribute("data-placeholdertype", "password");
						} catch (e) {}
					}

					//The placeholder attribute has a value. Keep track of the current placeholder value in an HTML5 data-* attribute
					element.setAttribute("data-currentplaceholder", placeholder);

					//If the value of the element is the empty string set the value to that of the placeholder attribute and apply the placeholder styles
					if (element.value === "" || element.value === placeholder) {
						element.className = element.className + " " + settings.className;
						element.value = placeholder;
					}

					//If the element has a containing form bind to the submit event so we can prevent placeholder values being submitted as actual values
					if (element.form) {

						//Get a reference to the containing form element (if present)
						form = element.form;

						//The placeholdersubmit data-* attribute is set if this form has already been dealt with
						if (!form.getAttribute("data-placeholdersubmit")) {

							//The placeholdersubmit attribute wasn't set, so attach a submit event handler
							addEventListener(form, "submit", submitHandler);

							//Set the placeholdersubmit attribute so we don't repeatedly bind event handlers to this form element
							form.setAttribute("data-placeholdersubmit", "true");
						}
					}

					//Attach event listeners to this element
					addEventListeners(element);
				}
			}
		}
	}

	/* The init function checks whether or not we need to polyfill the placeholder functionality. If we do, it sets up various things
	 * needed throughout the script and then calls createPlaceholders to setup initial placeholders */
	function init(opts) {

		//Create an input element to test for the presence of the placeholder property. If the placeholder property exists, stop.
		var test = document.createElement("input"),
			opt,
			styleElem,
			styleRules,
			i,
			j;

		//Test input element for presence of placeholder property. If it doesn't exist, the browser does not support HTML5 placeholders
		if (typeof test.placeholder === "undefined") {
			//HTML5 placeholder attribute not supported.

			//Set the options (or use defaults)
			for (opt in opts) {
				if (opts.hasOwnProperty(opt)) {
					settings[opt] = opts[opt];
				}
			}

			//Create style element for placeholder styles
			styleElem = document.createElement("style");
			styleElem.type = "text/css";

			//Create style rules as text node
			var importantValue = (settings.styleImportant) ? "!important" : "";
			styleRules = document.createTextNode("." + settings.className + " { color:" + settings.textColor  + importantValue + "; }");

			//Append style rules to newly created stylesheet
			if (styleElem.styleSheet) {
				styleElem.styleSheet.cssText = styleRules.nodeValue;
			} else {
				styleElem.appendChild(styleRules);
			}

			//Append new style element to the head
			document.getElementsByTagName("head")[0].appendChild(styleElem);

			//We use Array.prototype.indexOf later, so make sure it exists
			if (!Array.prototype.indexOf) {
				Array.prototype.indexOf = function (obj, start) {
					for (i = (start || 0), j = this.length; i < j; i += 1) {
						if (this[i] === obj) { return i; }
					}
					return -1;
				};
			}

			/* We use Function.prototype.bind later, so make sure it exists. This is the MDN implementation, slightly modified to pass JSLint. See
			 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind */
			if (!Function.prototype.bind) {
				Function.prototype.bind = function (oThis) {
					if (typeof this !== "function") {
						throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
					}
					var aArgs = Array.prototype.slice.call(arguments, 1),
						fToBind = this,
						FNop = function () {},
						fBound = function () {
							return fToBind.apply(this instanceof FNop
								 ? this
								 : oThis,
							    aArgs.concat(Array.prototype.slice.call(arguments)));
						};
					FNop.prototype = this.prototype;
					fBound.prototype = new FNop();
					return fBound;
				};
			}

			//Create placeholders for input elements currently part of the DOM
			createPlaceholders();

			/* If the `live` option is truthy, call updatePlaceholders repeatedly to keep up to date with any DOM changes.
			 * We use an interval over events such as DOMAttrModified (which are used in some other implementations of the placeholder attribute)
			 * since the DOM level 2 mutation events are deprecated in the level 3 spec. */
			if (settings.live) {
				interval = setInterval(updatePlaceholders, 100);
			}

			//Placeholder attribute was successfully polyfilled :)
			return true;
		}

		//Placeholder attribute already supported by browser :)
		return false;
	}

	//Expose public methods
	return {
		init: init,
		refresh: updatePlaceholders
	};
}());

/*!
 * jQuery Cycle2 - Version: 20130327
 * http://malsup.com/jquery/cycle2/
 * Copyright (c) 2012 M. Alsup; Dual licensed: MIT/GPL
 * Requires: jQuery v1.7 or later
 */
;(function($) {
"use strict";

var version = '20130323';

$.fn.cycle = function( options ) {
    // fix mistakes with the ready state
    var o;
    if ( this.length === 0 && !$.isReady ) {
        o = { s: this.selector, c: this.context };
        $.fn.cycle.log('requeuing slideshow (dom not ready)');
        $(function() {
            $( o.s, o.c ).cycle(options);
        });
        return this;
    }

    return this.each(function() {
        var data, opts, shortName, val;
        var container = $(this);
        var log = $.fn.cycle.log;

        if ( container.data('cycle.opts') )
            return; // already initialized

        if ( container.data('cycle-log') === false || 
            ( options && options.log === false ) ||
            ( opts && opts.log === false) ) {
            log = $.noop;
        }

        log('--c2 init--');
        data = container.data();
        for (var p in data) {
            // allow props to be accessed sans 'cycle' prefix and log the overrides
            if (data.hasOwnProperty(p) && /^cycle[A-Z]+/.test(p) ) {
                val = data[p];
                shortName = p.match(/^cycle(.*)/)[1].replace(/^[A-Z]/, lowerCase);
                log(shortName+':', val, '('+typeof val +')');
                data[shortName] = val;
            }
        }

        opts = $.extend( {}, $.fn.cycle.defaults, data, options || {});

        opts.timeoutId = 0;
        opts.paused = opts.paused || false; // #57
        opts.container = container;
        opts._maxZ = opts.maxZ;

        opts.API = $.extend ( { _container: container }, $.fn.cycle.API );
        opts.API.log = log;
        opts.API.trigger = function( eventName, args ) {
            opts.container.trigger( eventName, args );
            return opts.API;
        };

        container.data( 'cycle.opts', opts );
        container.data( 'cycle.API', opts.API );

        // opportunity for plugins to modify opts and API
        opts.API.trigger('cycle-bootstrap', [ opts, opts.API ]);

        opts.API.addInitialSlides();
        opts.API.preInitSlideshow();

        if ( opts.slides.length )
            opts.API.initSlideshow();
    });
};

$.fn.cycle.API = {
    opts: function() {
        return this._container.data( 'cycle.opts' );
    },
    addInitialSlides: function() {
        var opts = this.opts();
        var slides = opts.slides;
        opts.slideCount = 0;
        opts.slides = $(); // empty set
        
        // add slides that already exist
        slides = slides.jquery ? slides : opts.container.find( slides );

        if ( opts.random ) {
            slides.sort(function() {return Math.random() - 0.5;});
        }

        opts.API.add( slides );
    },

    preInitSlideshow: function() {
        var opts = this.opts();
        opts.API.trigger('cycle-pre-initialize', [ opts ]);
        var tx = $.fn.cycle.transitions[opts.fx];
        if (tx && $.isFunction(tx.preInit))
            tx.preInit( opts );
        opts._preInitialized = true;
    },

    postInitSlideshow: function() {
        var opts = this.opts();
        opts.API.trigger('cycle-post-initialize', [ opts ]);
        var tx = $.fn.cycle.transitions[opts.fx];
        if (tx && $.isFunction(tx.postInit))
            tx.postInit( opts );
    },

    initSlideshow: function() {
        var opts = this.opts();
        var pauseObj = opts.container;
        var slideOpts;
        opts.API.calcFirstSlide();

        if ( opts.container.css('position') == 'static' )
            opts.container.css('position', 'relative');

        $(opts.slides[opts.currSlide]).css('opacity',1).show();
        opts.API.stackSlides( opts.slides[opts.currSlide], opts.slides[opts.nextSlide], !opts.reverse );

        if ( opts.pauseOnHover ) {
            // allow pauseOnHover to specify an element
            if ( opts.pauseOnHover !== true )
                pauseObj = $( opts.pauseOnHover );

            pauseObj.hover(
                function(){ opts.API.pause( true ); }, 
                function(){ opts.API.resume( true ); }
            );
        }

        // stage initial transition
        if ( opts.timeout ) {
            slideOpts = opts.API.getSlideOpts( opts.nextSlide );
            opts.API.queueTransition( slideOpts, opts.timeout + opts.delay );
        }

        opts._initialized = true;
        opts.API.updateView( true );
        opts.API.trigger('cycle-initialized', [ opts ]);
        opts.API.postInitSlideshow();
    },

    pause: function( hover ) {
        var opts = this.opts(),
            slideOpts = opts.API.getSlideOpts(),
            alreadyPaused = opts.hoverPaused || opts.paused;

        if ( hover )
            opts.hoverPaused = true; 
        else
            opts.paused = true;

        if ( ! alreadyPaused ) {
            opts.container.addClass('cycle-paused');
            opts.API.trigger('cycle-paused', [ opts ]).log('cycle-paused');

            if ( slideOpts.timeout ) {
                clearTimeout( opts.timeoutId );
                opts.timeoutId = 0;
                
                // determine how much time is left for the current slide
                opts._remainingTimeout -= ( $.now() - opts._lastQueue );
                if ( opts._remainingTimeout < 0 )
                    opts._remainingTimeout = undefined;
            }
        }
    },

    resume: function( hover ) {
        var opts = this.opts(),
            alreadyResumed = !opts.hoverPaused && !opts.paused,
            remaining;

        if ( hover )
            opts.hoverPaused = false; 
        else
            opts.paused = false;

        if ( ! alreadyResumed ) {
            opts.container.removeClass('cycle-paused');
            opts.API.queueTransition( opts.API.getSlideOpts(), opts._remainingTimeout );
            opts.API.trigger('cycle-resumed', [ opts, opts._remainingTimeout ] ).log('cycle-resumed');
        }
    },

    add: function( slides, prepend ) {
        var opts = this.opts();
        var oldSlideCount = opts.slideCount;
        var startSlideshow = false;
        var len;

        if ( $.type(slides) == 'string')
            slides = $.trim( slides );

        $( slides ).each(function(i) {
            var slideOpts;
            var slide = $(this);

            if ( prepend )
                opts.container.prepend( slide );
            else
                opts.container.append( slide );

            opts.slideCount++;
            slideOpts = opts.API.buildSlideOpts( slide );

            if ( prepend )
                opts.slides = $( slide ).add( opts.slides );
            else
                opts.slides = opts.slides.add( slide );

            opts.API.initSlide( slideOpts, slide, --opts._maxZ );

            slide.data('cycle.opts', slideOpts);
            opts.API.trigger('cycle-slide-added', [ opts, slideOpts, slide ]);
        });

        opts.API.updateView( true );

        startSlideshow = opts._preInitialized && (oldSlideCount < 2 && opts.slideCount >= 1);
        if ( startSlideshow ) {
            if ( !opts._initialized )
                opts.API.initSlideshow();
            else if ( opts.timeout ) {
                len = opts.slides.length;
                opts.nextSlide = opts.reverse ? len - 1 : 1;
                if ( !opts.timeoutId ) {
                    opts.API.queueTransition( opts );
                }
            }
        }
    },

    calcFirstSlide: function() {
        var opts = this.opts();
        var firstSlideIndex;
        firstSlideIndex = parseInt( opts.startingSlide || 0, 10 );
        if (firstSlideIndex >= opts.slides.length || firstSlideIndex < 0)
            firstSlideIndex = 0;

        opts.currSlide = firstSlideIndex;
        if ( opts.reverse ) {
            opts.nextSlide = firstSlideIndex - 1;
            if (opts.nextSlide < 0)
                opts.nextSlide = opts.slides.length - 1;
        }
        else {
            opts.nextSlide = firstSlideIndex + 1;
            if (opts.nextSlide == opts.slides.length)
                opts.nextSlide = 0;
        }
    },

    calcNextSlide: function() {
        var opts = this.opts();
        var roll;
        if ( opts.reverse ) {
            roll = (opts.nextSlide - 1) < 0;
            opts.nextSlide = roll ? opts.slideCount - 1 : opts.nextSlide-1;
            opts.currSlide = roll ? 0 : opts.nextSlide+1;
        }
        else {
            roll = (opts.nextSlide + 1) == opts.slides.length;
            opts.nextSlide = roll ? 0 : opts.nextSlide+1;
            opts.currSlide = roll ? opts.slides.length-1 : opts.nextSlide-1;
        }
    },

    calcTx: function( slideOpts, manual ) {
        var opts = slideOpts;
        var tx;
        if ( manual && opts.manualFx )
            tx = $.fn.cycle.transitions[opts.manualFx];
        if ( !tx )
            tx = $.fn.cycle.transitions[opts.fx];

        if (!tx) {
            tx = $.fn.cycle.transitions.fade;
            opts.API.log('Transition "' + opts.fx + '" not found.  Using fade.');
        }
        return tx;
    },

    prepareTx: function( manual, fwd ) {
        var opts = this.opts();
        var after, curr, next, slideOpts, tx;

        if ( opts.slideCount < 2 ) {
            opts.timeoutId = 0;
            return;
        }
        if ( manual && ( !opts.busy || opts.manualTrump ) ) {
            opts.API.stopTransition();
            opts.busy = false;
            clearTimeout(opts.timeoutId);
            opts.timeoutId = 0;
        }
        if ( opts.busy )
            return;
        if ( opts.timeoutId === 0 && !manual )
            return;

        curr = opts.slides[opts.currSlide];
        next = opts.slides[opts.nextSlide];
        slideOpts = opts.API.getSlideOpts( opts.nextSlide );
        tx = opts.API.calcTx( slideOpts, manual );

        opts._tx = tx;

        if ( manual && slideOpts.manualSpeed !== undefined )
            slideOpts.speed = slideOpts.manualSpeed;

        // if ( opts.nextSlide === opts.currSlide )
        //     opts.API.calcNextSlide();

        // ensure that:
        //      1. advancing to a different slide
        //      2. this is either a manual event (prev/next, pager, cmd) or 
        //              a timer event and slideshow is not paused
        if ( opts.nextSlide != opts.currSlide && 
            (manual || (!opts.paused && !opts.hoverPaused && opts.timeout) )) { // #62

            opts.API.trigger('cycle-before', [ slideOpts, curr, next, fwd ]);
            if ( tx.before )
                tx.before( slideOpts, curr, next, fwd );

            after = function() {
                opts.busy = false;
                // #76; bail if slideshow has been destroyed
                if (! opts.container.data( 'cycle.opts' ) )
                    return;

                if (tx.after)
                    tx.after( slideOpts, curr, next, fwd );
                opts.API.trigger('cycle-after', [ slideOpts, curr, next, fwd ]);
                opts.API.queueTransition( slideOpts);
                opts.API.updateView( true );
            };

            opts.busy = true;
            if (tx.transition)
                tx.transition(slideOpts, curr, next, fwd, after);
            else
                opts.API.doTransition( slideOpts, curr, next, fwd, after);

            opts.API.calcNextSlide();
            opts.API.updateView();
        } else {
            opts.API.queueTransition( slideOpts );
        }
    },

    // perform the actual animation
    doTransition: function( slideOpts, currEl, nextEl, fwd, callback) {
        var opts = slideOpts;
        var curr = $(currEl), next = $(nextEl);
        var fn = function() {
            // make sure animIn has something so that callback doesn't trigger immediately
            next.animate(opts.animIn || { opacity: 1}, opts.speed, opts.easeIn || opts.easing, callback);
        };

        next.css(opts.cssBefore || {});
        curr.animate(opts.animOut || {}, opts.speed, opts.easeOut || opts.easing, function() {
            curr.css(opts.cssAfter || {});
            if (!opts.sync) {
                fn();
            }
        });
        if (opts.sync) {
            fn();
        }
    },

    queueTransition: function( slideOpts, specificTimeout ) {
        var opts = this.opts();
        var timeout = specificTimeout !== undefined ? specificTimeout : slideOpts.timeout;
        if (opts.nextSlide === 0 && --opts.loop === 0) {
            opts.API.log('terminating; loop=0');
            opts.timeout = 0;
            if ( timeout ) {
                setTimeout(function() {
                    opts.API.trigger('cycle-finished', [ opts ]);
                }, timeout);
            }
            else {
                opts.API.trigger('cycle-finished', [ opts ]);
            }
            // reset nextSlide
            opts.nextSlide = opts.currSlide;
            return;
        }
        if ( timeout ) {
            opts._lastQueue = $.now();
            if ( specificTimeout === undefined )
                opts._remainingTimeout = slideOpts.timeout;

            if ( !opts.paused && ! opts.hoverPaused ) {
                opts.timeoutId = setTimeout(function() { 
                    opts.API.prepareTx( false, !opts.reverse ); 
                }, timeout );
            }
        }
    },

    stopTransition: function() {
        var opts = this.opts();
        if ( opts.slides.filter(':animated').length ) {
            opts.slides.stop(false, true);
            opts.API.trigger('cycle-transition-stopped', [ opts ]);
        }

        if ( opts._tx && opts._tx.stopTransition )
            opts._tx.stopTransition( opts );
    },

    // advance slide forward or back
    advanceSlide: function( val ) {
        var opts = this.opts();
        clearTimeout(opts.timeoutId);
        opts.timeoutId = 0;
        opts.nextSlide = opts.currSlide + val;
        
        if (opts.nextSlide < 0)
            opts.nextSlide = opts.slides.length - 1;
        else if (opts.nextSlide >= opts.slides.length)
            opts.nextSlide = 0;

        opts.API.prepareTx( true,  val >= 0 );
        return false;
    },

    buildSlideOpts: function( slide ) {
        var opts = this.opts();
        var val, shortName;
        var slideOpts = slide.data() || {};
        for (var p in slideOpts) {
            // allow props to be accessed sans 'cycle' prefix and log the overrides
            if (slideOpts.hasOwnProperty(p) && /^cycle[A-Z]+/.test(p) ) {
                val = slideOpts[p];
                shortName = p.match(/^cycle(.*)/)[1].replace(/^[A-Z]/, lowerCase);
                opts.API.log('['+(opts.slideCount-1)+']', shortName+':', val, '('+typeof val +')');
                slideOpts[shortName] = val;
            }
        }

        slideOpts = $.extend( {}, $.fn.cycle.defaults, opts, slideOpts );
        slideOpts.slideNum = opts.slideCount;

        try {
            // these props should always be read from the master state object
            delete slideOpts.API;
            delete slideOpts.slideCount;
            delete slideOpts.currSlide;
            delete slideOpts.nextSlide;
            delete slideOpts.slides;
        } catch(e) {
            // no op
        }
        return slideOpts;
    },

    getSlideOpts: function( index ) {
        var opts = this.opts();
        if ( index === undefined )
            index = opts.currSlide;

        var slide = opts.slides[index];
        var slideOpts = $(slide).data('cycle.opts');
        return $.extend( {}, opts, slideOpts );
    },
    
    initSlide: function( slideOpts, slide, suggestedZindex ) {
        var opts = this.opts();
        slide.css( slideOpts.slideCss || {} );
        if ( suggestedZindex > 0 )
            slide.css( 'zIndex', suggestedZindex );

        // ensure that speed settings are sane
        if ( isNaN( slideOpts.speed ) )
            slideOpts.speed = $.fx.speeds[slideOpts.speed] || $.fx.speeds._default;
        if ( !slideOpts.sync )
            slideOpts.speed = slideOpts.speed / 2;

        slide.addClass( opts.slideClass );
    },

    updateView: function( isAfter ) {
        var opts = this.opts();
        if ( !opts._initialized )
            return;
        var slideOpts = opts.API.getSlideOpts();
        var currSlide = opts.slides[ opts.currSlide ];

        if ( ! isAfter ) {
            opts.API.trigger('cycle-update-view-before', [ opts, slideOpts, currSlide ]);
            if ( opts.updateView < 0 )
                return;
        }

        if ( opts.slideActiveClass ) {
            opts.slides.removeClass( opts.slideActiveClass )
                .eq( opts.currSlide ).addClass( opts.slideActiveClass );
        }

        if ( isAfter && opts.hideNonActive )
            opts.slides.filter( ':not(.' + opts.slideActiveClass + ')' ).hide();

        opts.API.trigger('cycle-update-view', [ opts, slideOpts, currSlide, isAfter ]);
        opts.API.trigger('cycle-update-view-after', [ opts, slideOpts, currSlide ]);
    },

    getComponent: function( name ) {
        var opts = this.opts();
        var selector = opts[name];
        if (typeof selector === 'string') {
            // if selector is a child selector then use find, otherwise query full dom
            return (/^\s*\>/).test( selector ) ? opts.container.find( selector ) : $( selector );
        }
        if (selector.jquery)
            return selector;
        
        return $(selector);
    },

    stackSlides: function( curr, next, fwd ) {
        var opts = this.opts();
        if ( !curr ) {
            curr = opts.slides[opts.currSlide];
            next = opts.slides[opts.nextSlide];
            fwd = !opts.reverse;
        }

        // reset the zIndex for the common case:
        // curr slide on top,  next slide beneath, and the rest in order to be shown
        $(curr).css('zIndex', opts.maxZ);

        var i;
        var z = opts.maxZ - 2;
        var len = opts.slideCount;
        if (fwd) {
            for ( i = opts.currSlide + 1; i < len; i++ )
                $( opts.slides[i] ).css( 'zIndex', z-- );
            for ( i = 0; i < opts.currSlide; i++ )
                $( opts.slides[i] ).css( 'zIndex', z-- );
        }
        else {
            for ( i = opts.currSlide - 1; i >= 0; i-- )
                $( opts.slides[i] ).css( 'zIndex', z-- );
            for ( i = len - 1; i > opts.currSlide; i-- )
                $( opts.slides[i] ).css( 'zIndex', z-- );
        }

        $(next).css('zIndex', opts.maxZ - 1);
    },

    getSlideIndex: function( el ) {
        return this.opts().slides.index( el );
    }

}; // API

// default logger
$.fn.cycle.log = function log() {
    /*global console:true */
    if (window.console && console.log)
        console.log('[cycle2] ' + Array.prototype.join.call(arguments, ' ') );
};

$.fn.cycle.version = function() { return 'Cycle2: ' + version; };

// helper functions

function lowerCase(s) {
    return (s || '').toLowerCase();
}

// expose transition object
$.fn.cycle.transitions = {
    custom: {
    },
    none: {
        before: function( opts, curr, next, fwd ) {
            opts.API.stackSlides( next, curr, fwd );
            opts.cssBefore = { opacity: 1, display: 'block' };
        }
    },
    fade: {
        before: function( opts, curr, next, fwd ) {
            var css = opts.API.getSlideOpts( opts.nextSlide ).slideCss || {};
            opts.API.stackSlides( curr, next, fwd );
            opts.cssBefore = $.extend(css, { opacity: 0, display: 'block' });
            opts.animIn = { opacity: 1 };
            opts.animOut = { opacity: 0 };
        }
    },
    fadeout: {
        before: function( opts , curr, next, fwd ) {
            var css = opts.API.getSlideOpts( opts.nextSlide ).slideCss || {};
            opts.API.stackSlides( curr, next, fwd );
            opts.cssBefore = $.extend(css, { opacity: 1, display: 'block' });
            opts.animOut = { opacity: 0 };
        }
    },
    scrollHorz: {
        before: function( opts, curr, next, fwd ) {
            opts.API.stackSlides( curr, next, fwd );
            var w = opts.container.css('overflow','hidden').width();
            opts.cssBefore = { left: fwd ? w : - w, top: 0, opacity: 1, display: 'block' };
            opts.cssAfter = { zIndex: opts._maxZ - 2, left: 0 };
            opts.animIn = { left: 0 };
            opts.animOut = { left: fwd ? -w : w };
        }
    }
};

// @see: http://jquery.malsup.com/cycle2/api
$.fn.cycle.defaults = {
    allowWrap:        true,
    autoSelector:     '.cycle-slideshow[data-cycle-auto-init!=false]',
    delay:            0,
    easing:           null,
    fx:              'fade',
    hideNonActive:    true,
    loop:             0,
    manualFx:         undefined,
    manualSpeed:      undefined,
    manualTrump:      true,
    maxZ:             100,
    pauseOnHover:     false,
    reverse:          false,
    slideActiveClass: 'cycle-slide-active',
    slideClass:       'cycle-slide',
    slideCss:         { position: 'absolute', top: 0, left: 0 },
    slides:          '> img',
    speed:            500,
    startingSlide:    0,
    sync:             true,
    timeout:          4000,
    updateView:       -1
};

// automatically find and run slideshows
$(document).ready(function() {
    $( $.fn.cycle.defaults.autoSelector ).cycle();
});

})(jQuery);

/*! Cycle2 autoheight plugin; Copyright (c) M.Alsup, 2012; version: 20130326 */
(function($) {
"use strict";

$.extend($.fn.cycle.defaults, {
    autoHeight: 0 // setting this option to false disables autoHeight logic
});    

$(document).on( 'cycle-initialized', function( e, opts ) {
    var autoHeight = opts.autoHeight;
    var t = $.type( autoHeight );
    var resizeThrottle = null;
    var ratio;

    if ( t !== 'string' && t !== 'number' )
        return;

    // bind events
    opts.container.on( 'cycle-slide-added cycle-slide-removed', initAutoHeight );
    opts.container.on( 'cycle-destroyed', onDestroy );

    if ( autoHeight == 'container' ) {
        opts.container.on( 'cycle-before', onBefore );
    }
    else if ( t === 'string' && /\d+\:\d+/.test( autoHeight ) ) { 
        // use ratio
        ratio = autoHeight.match(/(\d+)\:(\d+)/);
        ratio = ratio[1] / ratio[2];
        opts._autoHeightRatio = ratio;
    }

    // if autoHeight is a number then we don't need to recalculate the sentinel
    // index on resize
    if ( t !== 'number' ) {
        // bind unique resize handler per slideshow (so it can be 'off-ed' in onDestroy)
        opts._autoHeightOnResize = function () {
            clearTimeout( resizeThrottle );
            resizeThrottle = setTimeout( onResize, 50 );
        };

        $(window).on( 'resize orientationchange', opts._autoHeightOnResize );
    }

    setTimeout( onResize, 30 );

    function onResize() {
        initAutoHeight( e, opts );
    }
});

function initAutoHeight( e, opts ) {
    var clone, height, sentinelIndex;
    var autoHeight = opts.autoHeight;

    if ( autoHeight == 'container' ) {
        height = $( opts.slides[ opts.currSlide ] ).outerHeight();
        opts.container.height( height );
    }
    else if ( opts._autoHeightRatio ) { 
        opts.container.height( opts.container.width() / opts._autoHeightRatio );
    }
    else if ( autoHeight === 'calc' || ( $.type( autoHeight ) == 'number' && autoHeight >= 0 ) ) {
        if ( autoHeight === 'calc' )
            sentinelIndex = calcSentinelIndex( e, opts );
        else if ( autoHeight >= opts.slides.length )
            sentinelIndex = 0;
        else 
            sentinelIndex = autoHeight;

        // only recreate sentinel if index is different
        if ( sentinelIndex == opts._sentinelIndex )
            return;

        opts._sentinelIndex = sentinelIndex;
        if ( opts._sentinel )
            opts._sentinel.remove();

        // clone existing slide as sentinel
        clone = $( opts.slides[ sentinelIndex ].cloneNode(true) );
        
        // #50; remove special attributes from cloned content
        clone.removeAttr( 'id name rel' ).find( '[id],[name],[rel]' ).removeAttr( 'id name rel' );

        clone.css({
            position: 'static',
            visibility: 'hidden',
            display: 'block'
        }).prependTo( opts.container ).addClass('cycle-sentinel cycle-slide');
        clone.find( '*' ).css( 'visibility', 'hidden' );

        opts._sentinel = clone;
    }
}    

function calcSentinelIndex( e, opts ) {
    var index = 0, max = -1;

    // calculate tallest slide index
    opts.slides.each(function(i) {
        var h = $(this).height();
        if ( h > max ) {
            max = h;
            index = i;
        }
    });
    return index;
}

function onBefore( e, opts, outgoing, incoming, forward ) {
    var h = $(incoming).outerHeight();
    var duration = opts.sync ? opts.speed / 2 : opts.speed;
    opts.container.animate( { height: h }, duration );
}

function onDestroy( e, opts ) {
    if ( opts._autoHeightOnResize ) {
        $(window).off( 'resize orientationchange', opts._autoHeightOnResize );
        opts._autoHeightOnResize = null;
    }
    opts.container.off( 'cycle-slide-added cycle-slide-removed', initAutoHeight );
    opts.container.off( 'cycle-destroyed', onDestroy );
    opts.container.off( 'cycle-before', onBefore );

    if ( opts._sentinel ) {
        opts._sentinel.remove();
        opts._sentinel = null;
    }
}

})(jQuery);

/*! caption plugin for Cycle2;  version: 20130306 */
(function($) {
"use strict";

$.extend($.fn.cycle.defaults, {
    caption:          '> .cycle-caption',
    captionTemplate:  '{{slideNum}} / {{slideCount}}',
    overlay:          '> .cycle-overlay',
    overlayTemplate:  '<div>{{title}}</div><div>{{desc}}</div>',
    captionModule:    'caption'
});    

$(document).on( 'cycle-update-view', function( e, opts, slideOpts, currSlide ) {
    if ( opts.captionModule !== 'caption' )
        return;
    var el;
    $.each(['caption','overlay'], function() {
        var name = this; 
        var template = slideOpts[name+'Template'];
        var el = opts.API.getComponent( name );
        if( el.length && template ) {
            el.html( opts.API.tmpl( template, slideOpts, opts, currSlide ) );
            el.show();
        }
        else {
            el.hide();
        }
    });
});

$(document).on( 'cycle-destroyed', function( e, opts ) {
    var el;
    $.each(['caption','overlay'], function() {
        var name = this, template = opts[name+'Template'];
        if ( opts[name] && template ) {
            el = opts.API.getComponent( 'caption' );
            el.empty();
        }
    });
});

})(jQuery);

/*! command plugin for Cycle2;  version: 20130323 */
(function($) {
"use strict";

var c2 = $.fn.cycle;

$.fn.cycle = function( options ) {
    var cmd, cmdFn, opts;
    var args = $.makeArray( arguments );

    if ( $.type( options ) == 'number' ) {
        return this.cycle( 'goto', options );
    }

    if ( $.type( options ) == 'string' ) {
        return this.each(function() {
            var cmdArgs;
            cmd = options;
            opts = $(this).data('cycle.opts');

            if ( opts === undefined ) {
                c2.log('slideshow must be initialized before sending commands; "' + cmd + '" ignored');
                return;
            }
            else {
                cmd = cmd == 'goto' ? 'jump' : cmd; // issue #3; change 'goto' to 'jump' internally
                cmdFn = opts.API[ cmd ];
                if ( $.isFunction( cmdFn )) {
                    cmdArgs = $.makeArray( args );
                    cmdArgs.shift();
                    return cmdFn.apply( opts.API, cmdArgs );
                }
                else {
                    c2.log( 'unknown command: ', cmd );
                }
            }
        });
    }
    else {
        return c2.apply( this, arguments );
    }
};

// copy props
$.extend( $.fn.cycle, c2 );

$.extend( c2.API, {
    next: function() {
        var opts = this.opts();
        if ( opts.busy && ! opts.manualTrump )
            return;
        
        var count = opts.reverse ? -1 : 1;
        if ( opts.allowWrap === false && ( opts.currSlide + count ) >= opts.slideCount )
            return;

        opts.API.advanceSlide( count );
        opts.API.trigger('cycle-next', [ opts ]).log('cycle-next');
    },

    prev: function() {
        var opts = this.opts();
        if ( opts.busy && ! opts.manualTrump )
            return;
        var count = opts.reverse ? 1 : -1;
        if ( opts.allowWrap === false && ( opts.currSlide + count ) < 0 )
            return;

        opts.API.advanceSlide( count );
        opts.API.trigger('cycle-prev', [ opts ]).log('cycle-prev');
    },

    destroy: function() {
        var opts = this.opts();
        clearTimeout(opts.timeoutId);
        opts.timeoutId = 0;
        opts.API.stop();
        opts.API.trigger( 'cycle-destroyed', [ opts ] ).log('cycle-destroyed');
        opts.container.removeData( 'cycle.opts' );

        // #75; remove inline styles
        if ( ! opts.retainStylesOnDestroy ) {
            opts.container.removeAttr( 'style' );
            opts.slides.removeAttr( 'style' );
            opts.slides.removeClass( 'cycle-slide-active' );
        }
    },

    jump: function( index ) {
        // go to the requested slide
        var fwd;
        var opts = this.opts();
        if ( opts.busy && ! opts.manualTrump )
            return;
        var num = parseInt( index, 10 );
        if (isNaN(num) || num < 0 || num >= opts.slides.length) {
            opts.API.log('goto: invalid slide index: ' + num);
            return;
        }
        if (num == opts.currSlide) {
            opts.API.log('goto: skipping, already on slide', num);
            return;
        }
        opts.nextSlide = num;
        clearTimeout(opts.timeoutId);
        opts.timeoutId = 0;
        opts.API.log('goto: ', num, ' (zero-index)');
        fwd = opts.currSlide < opts.nextSlide;
        opts.API.prepareTx( true, fwd );
    },

    stop: function() {
        var opts = this.opts();
        var pauseObj = opts.container;
        clearTimeout(opts.timeoutId);
        opts.timeoutId = 0;
        opts.API.stopTransition();
        if ( opts.pauseOnHover ) {
            if ( opts.pauseOnHover !== true )
                pauseObj = $( opts.pauseOnHover );
            pauseObj.off('mouseenter mouseleave');
        }
        opts.API.trigger('cycle-stopped', [ opts ]).log('cycle-stopped');
    },

    reinit: function() {
        var opts = this.opts();
        opts.API.destroy();
        opts.container.cycle();
    },

    remove: function( index ) {
        var opts = this.opts();
        var slide, slideToRemove, slides = [], slideNum = 1;
        for ( var i=0; i < opts.slides.length; i++ ) {
            slide = opts.slides[i];
            if ( i == index ) {
                slideToRemove = slide;
            }
            else {
                slides.push( slide );
                $( slide ).data('cycle.opts').slideNum = slideNum;
                slideNum++;
            }
        }
        if ( slideToRemove ) {
            opts.slides = $( slides );
            opts.slideCount--;
            $( slideToRemove ).remove();
            if (index == opts.currSlide) {
                opts.API.advanceSlide( 1 );
            }

            opts.API.trigger('cycle-slide-removed', [ opts, index, slideToRemove ]).log('cycle-slide-removed');
            opts.API.updateView();
        }
    }

});

// listen for clicks on elements with data-cycle-cmd attribute
$(document).on('click.cycle', '[data-cycle-cmd]', function(e) {
    // issue cycle command
    e.preventDefault();
    var el = $(this);
    var command = el.data('cycle-cmd');
    var context = el.data('cycle-context') || '.cycle-slideshow';
    $(context).cycle(command, el.data('cycle-arg'));
});


})(jQuery);

/*! hash plugin for Cycle2;  version: 20121120 */
(function($) {
"use strict";

$(document).on( 'cycle-pre-initialize', function( e, opts ) {
    onHashChange( opts, true );

    opts._onHashChange = function() {
        onHashChange( opts, false );
    };

    $( window ).on( 'hashchange', opts._onHashChange);
});

$(document).on( 'cycle-update-view', function( e, opts, slideOpts ) {
    if ( slideOpts.hash ) {
        opts._hashFence = true;
        window.location.hash = slideOpts.hash;
    }
});

$(document).on( 'cycle-destroyed', function( e, opts) {
    if ( opts._onHashChange ) {
        $( window ).off( 'hashchange', opts._onHashChange );
    }
});

function onHashChange( opts, setStartingSlide ) {
    var hash;
    if ( opts._hashFence ) {
        opts._hashFence = false;
        return;
    }
    
    hash = window.location.hash.substring(1);

    opts.slides.each(function(i) {
        if ( $(this).data( 'cycle-hash' ) == hash ) {
            if ( setStartingSlide === true ) {
                opts.startingSlide = i;
            }
            else {
                opts.nextSlide = i;
                opts.API.prepareTx( true, false );
            }
            return false;
        }
    });
}

})(jQuery);

/*! loader plugin for Cycle2;  version: 20130307 */
(function($) {
"use strict";

$.extend($.fn.cycle.defaults, {
    loader: false
});

$(document).on( 'cycle-bootstrap', function( e, opts ) {
    var addFn;

    if ( !opts.loader )
        return;

    // override API.add for this slideshow
    addFn = opts.API.add;
    opts.API.add = add;

    function add( slides, prepend ) {
        var slideArr = [];
        if ( $.type( slides ) == 'string' )
            slides = $.trim( slides );
        else if ( $.type( slides) === 'array' ) {
            for (var i=0; i < slides.length; i++ )
                slides[i] = $(slides[i])[0];
        }

        slides = $( slides );
        var slideCount = slides.length;

        if ( ! slideCount )
            return;

        slides.hide().appendTo('body').each(function(i) { // appendTo fixes #56
            var count = 0;
            var slide = $(this);
            var images = slide.is('img') ? slide : slide.find('img');
            slide.data('index', i);
            // allow some images to be marked as unimportant (and filter out images w/o src value)
            images = images.filter(':not(.cycle-loader-ignore)').filter(':not([src=""])');
            if ( ! images.length ) {
                --slideCount;
                slideArr.push( slide );
                return;
            }

            count = images.length;
            images.each(function() {
                // add images that are already loaded
                if ( this.complete ) {
                    imageLoaded();
                }
                else {
                    $(this).load(function() {
                        imageLoaded();
                    }).error(function() {
                        if ( --count === 0 ) {
                            // ignore this slide
                            opts.API.log('slide skipped; img not loaded:', this.src);
                            if ( --slideCount === 0 && opts.loader == 'wait') {
                                addFn.apply( opts.API, [ slideArr, prepend ] );
                            }
                        }
                    });
                }
            });

            function imageLoaded() {
                if ( --count === 0 ) {
                    --slideCount;
                    addSlide( slide );
                }
            }
        });

        if ( slideCount )
            opts.container.addClass('cycle-loading');
        

        function addSlide( slide ) {
            var curr;
            if ( opts.loader == 'wait' ) {
                slideArr.push( slide );
                if ( slideCount === 0 ) {
                    // #59; sort slides into original markup order
                    slideArr.sort( sorter );
                    addFn.apply( opts.API, [ slideArr, prepend ] );
                    opts.container.removeClass('cycle-loading');
                }
            }
            else {
                curr = $(opts.slides[opts.currSlide]);
                addFn.apply( opts.API, [ slide, prepend ] );
                curr.show();
                opts.container.removeClass('cycle-loading');
            }
        }

        function sorter(a, b) {
            return a.data('index') - b.data('index');
        }
    }
});

})(jQuery);

/*! pager plugin for Cycle2;  version: 20130203 */
(function($) {
"use strict";

$.extend($.fn.cycle.defaults, {
    pager:            '> .cycle-pager',
    pagerActiveClass: 'cycle-pager-active',
    pagerEvent:       'click.cycle',
    pagerTemplate:    '<span>&bull;</span>'
});    

$(document).on( 'cycle-bootstrap', function( e, opts, API ) {
    // add method to API
    API.buildPagerLink = buildPagerLink;
});

$(document).on( 'cycle-slide-added', function( e, opts, slideOpts, slideAdded ) {
    if ( opts.pager ) {
        opts.API.buildPagerLink ( opts, slideOpts, slideAdded );
        opts.API.page = page;
    }
});

$(document).on( 'cycle-slide-removed', function( e, opts, index, slideRemoved ) {
    if ( opts.pager ) {
        var pagers = opts.API.getComponent( 'pager' );
        pagers.each(function() {
            var pager = $(this);
            $( pager.children()[index] ).remove();
        });
    }
});

$(document).on( 'cycle-update-view', function( e, opts, slideOpts ) {
    var pagers;

    if ( opts.pager ) {
        pagers = opts.API.getComponent( 'pager' );
        pagers.each(function() {
           $(this).children().removeClass( opts.pagerActiveClass )
            .eq( opts.currSlide ).addClass( opts.pagerActiveClass );
        });
    }
});

$(document).on( 'cycle-destroyed', function( e, opts ) {
    var pagers;
    if (opts.pager && opts.pagerTemplate) {
        pagers = opts.API.getComponent( 'pager' );
        pagers.empty();
    }
});

function buildPagerLink( opts, slideOpts, slide ) {
    var pagerLink;
    var pagers = opts.API.getComponent( 'pager' );
    pagers.each(function() {
        var pager = $(this);
        if ( slideOpts.pagerTemplate ) {
            var markup = opts.API.tmpl( slideOpts.pagerTemplate, slideOpts, opts, slide[0] );
            pagerLink = $( markup ).appendTo( pager );
        }
        else {
            pagerLink = pager.children().eq( opts.slideCount - 1 );
        }
        pagerLink.on( opts.pagerEvent, function(e) {
            e.preventDefault();
            opts.API.page( pager, e.currentTarget);
        });
    });
}

function page( pager, target ) {
    /*jshint validthis:true */
    var opts = this.opts();
    if ( opts.busy && ! opts.manualTrump )
        return;

    var index = pager.children().index( target );
    var nextSlide = index;
    var fwd = opts.currSlide < nextSlide;
    if (opts.currSlide == nextSlide) {
        return; // no op, clicked pager for the currently displayed slide
    }
    opts.nextSlide = nextSlide;
    opts.API.prepareTx( true, fwd );
    opts.API.trigger('cycle-pager-activated', [opts, pager, target ]);
}

})(jQuery);


/*! prevnext plugin for Cycle2;  version: 20130307 */
(function($) {
"use strict";

$.extend($.fn.cycle.defaults, {
    next:           '> .cycle-next',
    nextEvent:      'click.cycle',
    disabledClass:  'disabled',
    prev:           '> .cycle-prev',
    prevEvent:      'click.cycle',
    swipe:          false
});    

$(document).on( 'cycle-initialized', function( e, opts ) {
    opts.API.getComponent( 'next' ).on( opts.nextEvent, function(e) {
        e.preventDefault();
        opts.API.next();
    });

    opts.API.getComponent( 'prev' ).on( opts.prevEvent, function(e) {
        e.preventDefault();
        opts.API.prev();
    });

    if ( opts.swipe ) {
        var nextEvent = opts.swipeVert ? 'swipeUp.cycle' : 'swipeLeft.cycle swipeleft.cycle';
        var prevEvent = opts.swipeVert ? 'swipeDown.cycle' : 'swipeRight.cycle swiperight.cycle';
        opts.container.on( nextEvent, function(e) {
            opts.API.next();
        });
        opts.container.on( prevEvent, function() {
            opts.API.prev();
        });
    }
});

$(document).on( 'cycle-update-view', function( e, opts, slideOpts, currSlide ) {
    if ( opts.allowWrap )
        return;

    var cls = opts.disabledClass;
    var next = opts.API.getComponent( 'next' );
    var prev = opts.API.getComponent( 'prev' );
    var prevBoundry = opts._prevBoundry || 0;
    var nextBoundry = opts._nextBoundry || opts.slideCount - 1;

    if ( opts.currSlide == nextBoundry )
        next.addClass( cls ).prop( 'disabled', true );
    else
        next.removeClass( cls ).prop( 'disabled', false );

    if ( opts.currSlide === prevBoundry )
        prev.addClass( cls ).prop( 'disabled', true );
    else
        prev.removeClass( cls ).prop( 'disabled', false );
});


$(document).on( 'cycle-destroyed', function( e, opts ) {
    opts.API.getComponent( 'prev' ).off( opts.nextEvent );
    opts.API.getComponent( 'next' ).off( opts.prevEvent );
    opts.container.off( 'swipeleft.cycle swiperight.cycle swipeLeft.cycle swipeRight.cycle swipeUp.cycle swipeDown.cycle' );
});

})(jQuery);

/*! progressive loader plugin for Cycle2;  version: 20130315 */
(function($) {
"use strict";

$.extend($.fn.cycle.defaults, {
    progressive: false
});

$(document).on( 'cycle-pre-initialize', function( e, opts ) {
    if ( !opts.progressive )
        return;

    var API = opts.API;
    var nextFn = API.next;
    var prevFn = API.prev;
    var prepareTxFn = API.prepareTx;
    var type = $.type( opts.progressive );
    var slides, scriptEl;

    if ( type == 'array' ) {
        slides = opts.progressive;
    }
    else if ($.isFunction( opts.progressive ) ) {
        slides = opts.progressive( opts );
    }
    else if ( type == 'string' ) {
        scriptEl = $( opts.progressive );
        slides = $.trim( scriptEl.html() );
        if ( !slides )
            return;
        // is it json array?
        if ( /^(\[)/.test( slides ) ) {
            try {
                slides = $.parseJSON( slides );
            }
            catch(err) {
                API.log( 'error parsing progressive slides', err );
                return;
            }
        }
        else {
            // plain text, split on delimeter
            slides = slides.split( new RegExp( scriptEl.data('cycle-split') || '\n') );
            
            // #95; look for empty slide
            if ( ! slides[ slides.length - 1 ] )
                slides.pop();
        }
    }



    if ( prepareTxFn ) {
        API.prepareTx = function( manual, fwd ) {
            var index, slide;

            if ( manual || slides.length === 0 ) {
                prepareTxFn.apply( opts.API, [ manual, fwd ] );
                return;
            }

            if ( fwd && opts.currSlide == ( opts.slideCount-1) ) {
                slide = slides[ 0 ];
                slides = slides.slice( 1 );
                opts.container.one('cycle-slide-added', function(e, opts ) {
                    setTimeout(function() {
                        opts.API.advanceSlide( 1 );
                    },50);
                });
                opts.API.add( slide );
            }
            else if ( !fwd && opts.currSlide === 0 ) {
                index = slides.length-1;
                slide = slides[ index ];
                slides = slides.slice( 0, index );
                opts.container.one('cycle-slide-added', function(e, opts ) {
                    setTimeout(function() {
                        opts.currSlide = 1;
                        opts.API.advanceSlide( -1 );
                    },50);
                });
                opts.API.add( slide, true );
            }
            else {
                prepareTxFn.apply( opts.API, [ manual, fwd ] );
            }
        };
    }

    if ( nextFn ) {
        API.next = function() {
            var opts = this.opts();
            if ( slides.length && opts.currSlide == ( opts.slideCount - 1 ) ) {
                var slide = slides[ 0 ];
                slides = slides.slice( 1 );
                opts.container.one('cycle-slide-added', function(e, opts ) {
                    nextFn.apply( opts.API );
                    opts.container.removeClass('cycle-loading');
                });
                opts.container.addClass('cycle-loading');
                opts.API.add( slide );
            }
            else {
                nextFn.apply( opts.API );    
            }
        };
    }
    
    if ( prevFn ) {
        API.prev = function() {
            var opts = this.opts();
            if ( slides.length && opts.currSlide === 0 ) {
                var index = slides.length-1;
                var slide = slides[ index ];
                slides = slides.slice( 0, index );
                opts.container.one('cycle-slide-added', function(e, opts ) {
                    opts.currSlide = 1;
                    opts.API.advanceSlide( -1 );
                    opts.container.removeClass('cycle-loading');
                });
                opts.container.addClass('cycle-loading');
                opts.API.add( slide, true );
            }
            else {
                prevFn.apply( opts.API );
            }
        };
    }
});

})(jQuery);

/*! tmpl plugin for Cycle2;  version: 20121227 */
(function($) {
"use strict";

$.extend($.fn.cycle.defaults, {
    tmplRegex: '{{((.)?.*?)}}'
});

$.extend($.fn.cycle.API, {
    tmpl: function( str, opts /*, ... */) {
        var regex = new RegExp( opts.tmplRegex || $.fn.cycle.defaults.tmplRegex, 'g' );
        var args = $.makeArray( arguments );
        args.shift();
        return str.replace(regex, function(_, str) {
            var i, j, obj, prop, names = str.split('.');
            for (i=0; i < args.length; i++) {
                obj = args[i];
                if ( ! obj )
                    continue;
                if (names.length > 1) {
                    prop = obj;
                    for (j=0; j < names.length; j++) {
                        obj = prop;
                        prop = prop[ names[j] ] || str;
                    }
                } else {
                    prop = obj[str];
                }

                if ($.isFunction(prop))
                    return prop.apply(obj, args);
                if (prop !== undefined && prop !== null && prop != str)
                    return prop;
            }
            return str;
        });
    }
});    

})(jQuery);

/*!
 * GMaps.js v0.3.2
 * http://hpneo.github.com/gmaps/
 *
 * Copyright 2012, Gustavo Leon
 * Released under the MIT License.
 */

if(window.google && window.google.maps){

  var GMaps = (function(global) {
    "use strict";

    var doc = document;
    var getElementById = function(id, context) {
      var ele
      if('jQuery' in global && context){
        ele = $("#"+id.replace('#', ''), context)[0]
      } else {
        ele = doc.getElementById(id.replace('#', ''));
      };
      return ele;
    };

    var GMaps = function(options) {
      var self = this;

      var events_that_hide_context_menu = ['bounds_changed', 'center_changed', 'click', 'dblclick', 'drag', 'dragend', 'dragstart', 'idle', 'maptypeid_changed', 'projection_changed', 'resize', 'tilesloaded', 'zoom_changed'];
      var events_that_doesnt_hide_context_menu = ['mousemove', 'mouseout', 'mouseover'];

      window.context_menu = {};

      if (typeof(options.el) === 'string' || typeof(options.div) === 'string') {
        this.el = getElementById(options.el || options.div, options.context);
      } else {
        this.el = options.el || options.div;
      };

      if (typeof(this.el) === 'undefined' || this.el === null) {
        throw 'No element defined.';
      }

      this.el.style.width = options.width || this.el.scrollWidth || this.el.offsetWidth;
      this.el.style.height = options.height || this.el.scrollHeight || this.el.offsetHeight;

      this.controls = [];
      this.overlays = [];
      this.layers = []; // array with kml and ft layers, can be as many
      this.singleLayers = {}; // object with the other layers, only one per layer
      this.markers = [];
      this.polylines = [];
      this.routes = [];
      this.polygons = [];
      this.infoWindow = null;
      this.overlay_el = null;
      this.zoom = options.zoom || 15;
      this.registered_events = {};

      var markerClusterer = options.markerClusterer;

      //'Hybrid', 'Roadmap', 'Satellite' or 'Terrain'
      var mapType;

      if (options.mapType) {
        mapType = google.maps.MapTypeId[options.mapType.toUpperCase()];
      }
      else {
        mapType = google.maps.MapTypeId.ROADMAP;
      }

      var map_center = new google.maps.LatLng(options.lat, options.lng);

      delete options.el;
      delete options.lat;
      delete options.lng;
      delete options.mapType;
      delete options.width;
      delete options.height;
      delete options.markerClusterer;

      var zoomControlOpt = options.zoomControlOpt || {
        style: 'DEFAULT',
        position: 'TOP_LEFT'
      };

      var zoomControl = options.zoomControl || true,
          zoomControlStyle = zoomControlOpt.style || 'DEFAULT',
          zoomControlPosition = zoomControlOpt.position || 'TOP_LEFT',
          panControl = options.panControl || true,
          mapTypeControl = options.mapTypeControl || true,
          scaleControl = options.scaleControl || true,
          streetViewControl = options.streetViewControl || true,
          overviewMapControl = overviewMapControl || true;

      var map_options = {};

      var map_base_options = {
        zoom: this.zoom,
        center: map_center,
        mapTypeId: mapType
      };

      var map_controls_options = {
        panControl: panControl,
        zoomControl: zoomControl,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle[zoomControlStyle], // DEFAULT LARGE SMALL
          position: google.maps.ControlPosition[zoomControlPosition]
        },
        mapTypeControl: mapTypeControl,
        scaleControl: scaleControl,
        streetViewControl: streetViewControl,
        overviewMapControl: overviewMapControl
      }

      if(options.disableDefaultUI != true)
        map_base_options = extend_object(map_base_options, map_controls_options);

      map_options = extend_object(map_base_options, options);

      for(var i = 0; i < events_that_hide_context_menu.length; i++) {
        delete map_options[events_that_hide_context_menu[i]];
      }

      for(var i = 0; i < events_that_doesnt_hide_context_menu.length; i++) {
        delete map_options[events_that_doesnt_hide_context_menu[i]];
      }

      this.map = new google.maps.Map(this.el, map_options);

      if(markerClusterer) {
        this.markerClusterer = markerClusterer.apply(this, [this.map]);
      }

      // finds absolute position of an element
      var findAbsolutePosition = function(obj)  {
        var curleft = 0;
        var curtop = 0;
        if (obj.offsetParent) {
          do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
          } while (obj = obj.offsetParent);
        }
        return [curleft,curtop];
      //returns an array
      }


      // Context menus
      var buildContextMenuHTML = function(control, e) {
        var html = '';
        var options = window.context_menu[control];
        for (var i in options){
          if (options.hasOwnProperty(i)){
            var option = options[i];
            html += '<li><a id="' + control + '_' + i + '" href="#">' +
              option.title + '</a></li>';
          }
        }

        if(!getElementById('gmaps_context_menu')) return;

        var context_menu_element = getElementById('gmaps_context_menu');
        context_menu_element.innerHTML = html;

        var context_menu_items = context_menu_element.getElementsByTagName('a');

        var context_menu_items_count = context_menu_items.length;

        for(var i = 0; i < context_menu_items_count; i++){
          var context_menu_item = context_menu_items[i];

          var assign_menu_item_action = function(ev){
            ev.preventDefault();

            options[this.id.replace(control + '_', '')].action.apply(self, [e]);
            self.hideContextMenu();
          };

          google.maps.event.clearListeners(context_menu_item, 'click');
          google.maps.event.addDomListenerOnce(context_menu_item, 'click', assign_menu_item_action, false);
        }

        var position = findAbsolutePosition.apply(this, [self.el]);
        var left = position[0] + e.pixel.x - 15;
        var top = position[1] + e.pixel.y- 15;

        context_menu_element.style.left = left + "px";
        context_menu_element.style.top = top + "px";

        context_menu_element.style.display = 'block';
      };

      var buildContextMenu = function(control, e) {
        if (control === 'marker') {
          e.pixel = {};
          var overlay = new google.maps.OverlayView();
          overlay.setMap(self.map);
          overlay.draw = function() {
            var projection = overlay.getProjection();
            var position = e.marker.getPosition();
            e.pixel = projection.fromLatLngToContainerPixel(position);

            buildContextMenuHTML(control, e);
          };
        }
        else {
          buildContextMenuHTML(control, e);
        }
      };

      this.setContextMenu = function(options) {
        window.context_menu[options.control] = {};

        for (var i in options.options){
          if (options.options.hasOwnProperty(i)){
            var option = options.options[i];
            window.context_menu[options.control][option.name] = {
              title: option.title,
              action: option.action
            };
          }
        }

        var ul = doc.createElement('ul');

        ul.id = 'gmaps_context_menu';
        ul.style.display = 'none';
        ul.style.position = 'absolute';
        ul.style.minWidth = '100px';
        ul.style.background = 'white';
        ul.style.listStyle = 'none';
        ul.style.padding = '8px';
        ul.style.boxShadow = '2px 2px 6px #ccc';

        doc.body.appendChild(ul);

        var context_menu_element = getElementById('gmaps_context_menu');

        google.maps.event.addDomListener(context_menu_element, 'mouseout', function(ev) {
          if(!ev.relatedTarget || !this.contains(ev.relatedTarget)){
            window.setTimeout(function(){
              context_menu_element.style.display = 'none';
            }, 400);
          }
        }, false);
      };

      this.hideContextMenu = function() {
        var context_menu_element = getElementById('gmaps_context_menu');
        if(context_menu_element)
          context_menu_element.style.display = 'none';
      };

      //Events

      var setupListener = function(object, name) {
        google.maps.event.addListener(object, name, function(e){
          if(e == undefined) {
            e = this;
          }

          options[name].apply(this, [e]);

          self.hideContextMenu();
        });
      }

      for (var ev = 0; ev < events_that_hide_context_menu.length; ev++) {
        var name = events_that_hide_context_menu[ev];

        if (name in options) {
          setupListener(this.map, name);
        }
      }

      for (var ev = 0; ev < events_that_doesnt_hide_context_menu.length; ev++) {
        var name = events_that_doesnt_hide_context_menu[ev];

        if (name in options) {
          setupListener(this.map, name);
        }
      }

      google.maps.event.addListener(this.map, 'rightclick', function(e) {
        if (options.rightclick) {
          options.rightclick.apply(this, [e]);
        }

        if(window.context_menu['map'] != undefined) {
          buildContextMenu('map', e);
        }
      });

      this.refresh = function() {
        google.maps.event.trigger(this.map, 'resize');
      };

      this.fitZoom = function() {
        var latLngs = [];
        var markers_length = this.markers.length;

        for(var i=0; i < markers_length; i++) {
          latLngs.push(this.markers[i].getPosition());
        }

        this.fitLatLngBounds(latLngs);
      };

      this.fitLatLngBounds = function(latLngs) {
        var total = latLngs.length;
        var bounds = new google.maps.LatLngBounds();

        for(var i=0; i < total; i++) {
          bounds.extend(latLngs[i]);
        }

        this.map.fitBounds(bounds);
      };

      // Map methods
      this.setCenter = function(lat, lng, callback) {
        this.map.panTo(new google.maps.LatLng(lat, lng));
        if (callback) {
          callback();
        }
      };

      this.getElement = function() {
        return this.el;
      };

      this.zoomIn = function(value) {
        value = value || 1;
        this.zoom = this.map.getZoom() + value;
        this.map.setZoom(this.zoom);
      };

      this.zoomOut = function(value) {
        value = value || 1;
        this.zoom = this.map.getZoom() - value;
        this.map.setZoom(this.zoom);
      };

      var native_methods = [];

      for(var method in this.map){
        if(typeof(this.map[method]) == 'function' && !this[method]){
          native_methods.push(method);
        }
      }

      for(var i=0; i < native_methods.length; i++){
        (function(gmaps, scope, method_name) {
          gmaps[method_name] = function(){
            return scope[method_name].apply(scope, arguments);
          };
        })(this, this.map, native_methods[i]);
      }

      this.createControl = function(options) {
        var control = doc.createElement('div');

        control.style.cursor = 'pointer';
        control.style.fontFamily = 'Arial, sans-serif';
        control.style.fontSize = '13px';
        control.style.boxShadow = 'rgba(0, 0, 0, 0.398438) 0px 2px 4px';

        for(var option in options.style)
          control.style[option] = options.style[option];

        if(options.id) {
          control.id = options.id;
        }

        if(options.classes) {
          control.className = options.classes;
        }

        if(options.content) {
          control.innerHTML = options.content;
        }

        for (var ev in options.events) {
          (function(object, name) {
            google.maps.event.addDomListener(object, name, function(){
              options.events[name].apply(this, [this]);
            });
          })(control, ev);
        }

        control.index = 1;

        return control;
      };

      this.addControl = function(options) {
        var position = google.maps.ControlPosition[options.position.toUpperCase()];

        delete options.position;

        var control = this.createControl(options);
        this.controls.push(control);
        this.map.controls[position].push(control);

        return control;
      };

      // Markers
      this.createMarker = function(options) {
        if ((options.hasOwnProperty('lat') && options.hasOwnProperty('lng')) || options.position) {
          var self = this;
          var details = options.details;
          var fences = options.fences;
          var outside = options.outside;

          var base_options = {
            position: new google.maps.LatLng(options.lat, options.lng),
            map: null
          };

          delete options.lat;
          delete options.lng;
          delete options.fences;
          delete options.outside;

          var marker_options = extend_object(base_options, options);

          var marker = new google.maps.Marker(marker_options);

          marker.fences = fences;

          if (options.infoWindow) {
            marker.infoWindow = new google.maps.InfoWindow(options.infoWindow);

            var info_window_events = ['closeclick', 'content_changed', 'domready', 'position_changed', 'zindex_changed'];

            for (var ev = 0; ev < info_window_events.length; ev++) {
              (function(object, name) {
                if (options.infoWindow[name]) {
                  google.maps.event.addListener(object, name, function(e){
                    options.infoWindow[name].apply(this, [e]);
                  });
                }
              })(marker.infoWindow, info_window_events[ev]);
            }
          }

          var marker_events = ['animation_changed', 'clickable_changed', 'cursor_changed', 'draggable_changed', 'flat_changed', 'icon_changed', 'position_changed', 'shadow_changed', 'shape_changed', 'title_changed', 'visible_changed', 'zindex_changed'];

          var marker_events_with_mouse = ['dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mouseout', 'mouseover', 'mouseup'];

          for (var ev = 0; ev < marker_events.length; ev++) {
            (function(object, name) {
              if (options[name]) {
                google.maps.event.addListener(object, name, function(){
                  options[name].apply(this, [this]);
                });
              }
            })(marker, marker_events[ev]);
          }

          for (var ev = 0; ev < marker_events_with_mouse.length; ev++) {
            (function(map, object, name) {
              if (options[name]) {
                google.maps.event.addListener(object, name, function(me){
                  if(!me.pixel){
                    me.pixel = map.getProjection().fromLatLngToPoint(me.latLng)
                  }
                  
                  options[name].apply(this, [me]);
                });
              }
            })(this.map, marker, marker_events_with_mouse[ev]);
          }

          google.maps.event.addListener(marker, 'click', function() {
            this.details = details;

            if (options.click) {
              options.click.apply(this, [this]);
            }

            if (marker.infoWindow) {
              self.hideInfoWindows();
              marker.infoWindow.open(self.map, marker);
            }
          });

          google.maps.event.addListener(marker, 'rightclick', function(e) {
            e.marker = this;

            if (options.rightclick) {
              options.rightclick.apply(this, [e]);
            }

            if (window.context_menu['marker'] != undefined) {
              buildContextMenu('marker', e);
            }
          });

          if (marker.fences) {
            google.maps.event.addListener(marker, 'dragend', function() {
              self.checkMarkerGeofence(marker, function(m, f) {
                outside(m, f);
              });
            });
          }

          return marker;
        }
        else {
          throw 'No latitude or longitude defined.';
        }
      };

      this.addMarker = function(options) {
        var marker;
        if(options.hasOwnProperty('gm_accessors_')) {
          // Native google.maps.Marker object
          marker = options;
        }
        else {
          if ((options.hasOwnProperty('lat') && options.hasOwnProperty('lng')) || options.position) {
            marker = this.createMarker(options);
          }
          else {
            throw 'No latitude or longitude defined.';
          }
        }

        marker.setMap(this.map);

        if(this.markerClusterer) {
          this.markerClusterer.addMarker(marker);
        }

        this.markers.push(marker);

        GMaps.fire('marker_added', marker, this);

        return marker;
      };

      this.addMarkers = function(array) {
        for (var i=0, marker; marker=array[i]; i++) {
          this.addMarker(marker);
        }
        return this.markers;
      };

      this.hideInfoWindows = function() {
        for (var i=0, marker; marker=this.markers[i]; i++){
          if (marker.infoWindow){
            marker.infoWindow.close();
          }
        }
      };

      this.removeMarker = function(marker) {
        for(var i = 0; i < this.markers.length; i++) {
          if(this.markers[i] === marker) {
            this.markers[i].setMap(null);
            this.markers.splice(i, 1);

            GMaps.fire('marker_removed', marker, this);

            break;
          }
        }

        return marker;
      };

      this.removeMarkers = function(collection) {
        var collection = (collection || this.markers);

        for(var i=0;i < this.markers.length; i++){
          if(this.markers[i] === collection[i])
            this.markers[i].setMap(null);
        }

        var new_markers = [];

        for(var i=0;i < this.markers.length; i++){
          if(this.markers[i].getMap() != null)
            new_markers.push(this.markers[i]);
        }

        this.markers = new_markers;
      };

      // Overlays

      this.drawOverlay = function(options) {
        var overlay = new google.maps.OverlayView();
        overlay.setMap(self.map);

        var auto_show = true;

        if(options.auto_show != null)
          auto_show = options.auto_show;

        overlay.onAdd = function() {
          var el = doc.createElement('div');
          el.style.borderStyle = "none";
          el.style.borderWidth = "0px";
          el.style.position = "absolute";
          el.style.zIndex = 100;
          el.innerHTML = options.content;

          overlay.el = el;

          var panes = this.getPanes();
          if (!options.layer) {
            options.layer = 'overlayLayer';
          }
          var overlayLayer = panes[options.layer];
          overlayLayer.appendChild(el);

          var stop_overlay_events = ['contextmenu', 'DOMMouseScroll', 'dblclick', 'mousedown'];

          for (var ev = 0; ev < stop_overlay_events.length; ev++) {
            (function(object, name) {
              google.maps.event.addDomListener(object, name, function(e){
                if(navigator.userAgent.toLowerCase().indexOf('msie') != -1 && document.all) {
                  e.cancelBubble = true;
                  e.returnValue = false;
                }
                else {
                  e.stopPropagation();
                }
              });
            })(el, stop_overlay_events[ev]);
          }

          google.maps.event.trigger(this, 'ready');
        };

        overlay.draw = function() {
          var projection = this.getProjection();
          var pixel = projection.fromLatLngToDivPixel(new google.maps.LatLng(options.lat, options.lng));

          options.horizontalOffset = options.horizontalOffset || 0;
          options.verticalOffset = options.verticalOffset || 0;

          var el = overlay.el;
          var content = el.children[0];

          var content_height = content.clientHeight;
          var content_width = content.clientWidth;

          switch (options.verticalAlign) {
            case 'top':
              el.style.top = (pixel.y - content_height + options.verticalOffset) + 'px';
              break;
            default:
            case 'middle':
              el.style.top = (pixel.y - (content_height / 2) + options.verticalOffset) + 'px';
              break;
            case 'bottom':
              el.style.top = (pixel.y + options.verticalOffset) + 'px';
              break;
          }

          switch (options.horizontalAlign) {
            case 'left':
              el.style.left = (pixel.x - content_width + options.horizontalOffset) + 'px';
              break;
            default:
            case 'center':
              el.style.left = (pixel.x - (content_width / 2) + options.horizontalOffset) + 'px';
              break;
            case 'right':
              el.style.left = (pixel.x + options.horizontalOffset) + 'px';
              break;
          }

          el.style.display = auto_show ? 'block' : 'none';

          if(!auto_show){
            options.show.apply(this, [el]);
          }
        };

        overlay.onRemove = function() {
          var el = overlay.el;

          if(options.remove){
            options.remove.apply(this, [el]);
          }
          else {
            overlay.el.parentNode.removeChild(overlay.el);
            overlay.el = null;
          }
        };

        self.overlays.push(overlay);
        return overlay;
      };

      this.removeOverlay = function(overlay) {
        for(var i = 0; i < this.overlays.length; i++) {
          if(this.overlays[i] === overlay) {
            this.overlays[i].setMap(null);
            this.overlays.splice(i, 1);

            break;
          }
        }
      };

      this.removeOverlays = function() {
        for (var i=0, item; item=self.overlays[i]; i++){
          item.setMap(null);
        }
        self.overlays = [];
      };

      // Geometry

      this.drawPolyline = function(options) {
        var path = [];
        var points = options.path;

        if (points.length){
          if (points[0][0] === undefined){
            path = points;
          }
          else {
            for (var i=0, latlng; latlng=points[i]; i++){
              path.push(new google.maps.LatLng(latlng[0], latlng[1]));
            }
          }
        }

        var polyline_options = {
          map: this.map,
          path: path,
          strokeColor: options.strokeColor,
          strokeOpacity: options.strokeOpacity,
          strokeWeight: options.strokeWeight,
          geodesic: options.geodesic,
          clickable: true,
          editable: false,
          visible: true
        };

        if(options.hasOwnProperty("clickable"))
          polyline_options.clickable = options.clickable;

        if(options.hasOwnProperty("editable"))
          polyline_options.editable = options.editable;

        if(options.hasOwnProperty("icons"))
          polyline_options.icons = options.icons;

        if(options.hasOwnProperty("zIndex"))
          polyline_options.zIndex = options.zIndex;

        var polyline = new google.maps.Polyline(polyline_options);

        var polyline_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

        for (var ev = 0; ev < polyline_events.length; ev++) {
          (function(object, name) {
            if (options[name]) {
              google.maps.event.addListener(object, name, function(e){
                options[name].apply(this, [e]);
              });
            }
          })(polyline, polyline_events[ev]);
        }

        this.polylines.push(polyline);

        GMaps.fire('polyline_added', polyline, this);

        return polyline;
      };

      this.removePolyline = function(polyline) {
        for(var i = 0; i < this.polylines.length; i++) {
          if(this.polylines[i] === polyline) {
            this.polylines[i].setMap(null);
            this.polylines.splice(i, 1);

            GMaps.fire('polyline_removed', polyline, this);

            break;
          }
        }
      };

      this.removePolylines = function() {
        for (var i=0, item; item=self.polylines[i]; i++){
          item.setMap(null);
        }
        self.polylines = [];
      };

      this.drawCircle = function(options) {
        options =  extend_object({
          map: this.map,
          center: new google.maps.LatLng(options.lat, options.lng)
        }, options);

        delete options.lat;
        delete options.lng;
        var polygon = new google.maps.Circle(options);

        var polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

        for (var ev = 0; ev < polygon_events.length; ev++) {
          (function(object, name) {
            if (options[name]) {
              google.maps.event.addListener(object, name, function(e){
                options[name].apply(this, [e]);
              });
            }
          })(polygon, polygon_events[ev]);
        }

        this.polygons.push(polygon);

        return polygon;
      };

      this.drawRectangle = function(options) {
        options = extend_object({
          map: this.map
        }, options);

        var latLngBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(options.bounds[0][0], options.bounds[0][1]),
          new google.maps.LatLng(options.bounds[1][0], options.bounds[1][1])
        );

        options.bounds = latLngBounds;

        var polygon = new google.maps.Rectangle(options);

        var polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

        for (var ev = 0; ev < polygon_events.length; ev++) {
          (function(object, name) {
            if (options[name]) {
              google.maps.event.addListener(object, name, function(e){
                options[name].apply(this, [e]);
              });
            }
          })(polygon, polygon_events[ev]);
        }

        this.polygons.push(polygon);

        return polygon;
      };

      this.drawPolygon = function(options) {
        var useGeoJSON = false;
        if(options.hasOwnProperty("useGeoJSON"))
          useGeoJSON = options.useGeoJSON;

        delete options.useGeoJSON;

        options = extend_object({
          map: this.map
        }, options);

        if(useGeoJSON == false)
          options.paths = [options.paths.slice(0)];

        if(options.paths.length > 0) {
          if(options.paths[0].length > 0) {
            options.paths = array_flat(array_map(options.paths, arrayToLatLng, useGeoJSON));
          }
        }

        var polygon = new google.maps.Polygon(options);

        var polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

        for (var ev = 0; ev < polygon_events.length; ev++) {
          (function(object, name) {
            if (options[name]) {
              google.maps.event.addListener(object, name, function(e){
                options[name].apply(this, [e]);
              });
            }
          })(polygon, polygon_events[ev]);
        }

        this.polygons.push(polygon);

        GMaps.fire('polygon_added', polygon, this);

        return polygon;
      };

      this.removePolygon = function(polygon) {
        for(var i = 0; i < this.polygons.length; i++) {
          if(this.polygons[i] === polygon) {
            this.polygons[i].setMap(null);
            this.polygons.splice(i, 1);

            GMaps.fire('polygon_removed', polygon, this);

            break;
          }
        }
      };

      this.removePolygons = function() {
        for (var i=0, item; item=self.polygons[i]; i++){
          item.setMap(null);
        }
        self.polygons = [];
      };

      // Fusion Tables

      this.getFromFusionTables = function(options) {
        var events = options.events;

        delete options.events;

        var fusion_tables_options = options;

        var layer = new google.maps.FusionTablesLayer(fusion_tables_options);

        for (var ev in events) {
          (function(object, name) {
            google.maps.event.addListener(object, name, function(e){
              events[name].apply(this, [e]);
            });
          })(layer, ev);
        }

        this.layers.push(layer);

        return layer;
      };

      this.loadFromFusionTables = function(options) {
        var layer = this.getFromFusionTables(options);
        layer.setMap(this.map);

        return layer;
      };

      // KML

      this.getFromKML = function(options) {
        var url = options.url;
        var events = options.events;

        delete options.url;
        delete options.events;

        var kml_options = options;

        var layer = new google.maps.KmlLayer(url, kml_options);

        for (var ev in events) {
          (function(object, name) {
            google.maps.event.addListener(object, name, function(e){
              events[name].apply(this, [e]);
            });
          })(layer, ev);
        }

        this.layers.push(layer);

        return layer;
      };

      this.loadFromKML = function(options) {
        var layer = this.getFromKML(options);
        layer.setMap(this.map);

        return layer;
      };

      // Routes

      var travelMode, unitSystem;
      this.getRoutes = function(options) {
        switch (options.travelMode) {
        case 'bicycling':
          travelMode = google.maps.TravelMode.BICYCLING;
          break;
        case 'transit':
          travelMode = google.maps.TravelMode.TRANSIT;
          break;
        case 'driving':
          travelMode = google.maps.TravelMode.DRIVING;
          break;
        // case 'walking':
        default:
          travelMode = google.maps.TravelMode.WALKING;
          break;
        }

        if (options.unitSystem === 'imperial') {
          unitSystem = google.maps.UnitSystem.IMPERIAL;
        }
        else {
          unitSystem = google.maps.UnitSystem.METRIC;
        }

        var base_options = {
          avoidHighways: false,
          avoidTolls: false,
          optimizeWaypoints: false,
          waypoints: []
        };

        var request_options =  extend_object(base_options, options);

        request_options.origin = /string/.test(typeof options.origin) ? options.origin : new google.maps.LatLng(options.origin[0], options.origin[1]);
        request_options.destination = new google.maps.LatLng(options.destination[0], options.destination[1]);
        request_options.travelMode = travelMode;
        request_options.unitSystem = unitSystem;

        delete request_options.callback;

        var self = this;
        var service = new google.maps.DirectionsService();

        service.route(request_options, function(result, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            for (var r in result.routes) {
              if (result.routes.hasOwnProperty(r)) {
                self.routes.push(result.routes[r]);
              }
            }
          }
          if (options.callback) {
            options.callback(self.routes);
          }
        });
      };

      this.removeRoutes = function() {
        this.routes = [];
      };

      this.getElevations = function(options) {
        options = extend_object({
          locations: [],
          path : false,
          samples : 256
        }, options);

        if(options.locations.length > 0) {
          if(options.locations[0].length > 0) {
            options.locations = array_flat(array_map([options.locations], arrayToLatLng,  false));
          }
        }

        var callback = options.callback;
        delete options.callback;

        var service = new google.maps.ElevationService();

        //location request
        if (!options.path) {
          delete options.path;
          delete options.samples;
          service.getElevationForLocations(options, function(result, status){
            if (callback && typeof(callback) === "function") {
              callback(result, status);
            }
          });
        //path request
        } else {
          var pathRequest = {
            path : options.locations,
            samples : options.samples
          };

          service.getElevationAlongPath(pathRequest, function(result, status){
           if (callback && typeof(callback) === "function") {
              callback(result, status);
            }
          });
        }
      };

      // Alias for the method "drawRoute"
      this.cleanRoute = this.removePolylines;

      this.drawRoute = function(options) {
        var self = this;
        this.getRoutes({
          origin: options.origin,
          destination: options.destination,
          travelMode: options.travelMode,
          waypoints: options.waypoints,
          unitSystem: options.unitSystem,
          callback: function(e) {
            if (e.length > 0) {
              self.drawPolyline({
                path: e[e.length - 1].overview_path,
                strokeColor: options.strokeColor,
                strokeOpacity: options.strokeOpacity,
                strokeWeight: options.strokeWeight
              });
              if (options.callback) {
                options.callback(e[e.length - 1]);
              }
            }
          }
        });
      };

      this.travelRoute = function(options) {
        if (options.origin && options.destination) {
          this.getRoutes({
            origin: options.origin,
            destination: options.destination,
            travelMode: options.travelMode,
            waypoints : options.waypoints,
            callback: function(e) {
              //start callback
              if (e.length > 0 && options.start) {
                options.start(e[e.length - 1]);
              }

              //step callback
              if (e.length > 0 && options.step) {
                var route = e[e.length - 1];
                if (route.legs.length > 0) {
                  var steps = route.legs[0].steps;
                  for (var i=0, step; step=steps[i]; i++) {
                    step.step_number = i;
                    options.step(step, (route.legs[0].steps.length - 1));
                  }
                }
              }

              //end callback
              if (e.length > 0 && options.end) {
                 options.end(e[e.length - 1]);
              }
            }
          });
        }
        else if (options.route) {
          if (options.route.legs.length > 0) {
            var steps = options.route.legs[0].steps;
            for (var i=0, step; step=steps[i]; i++) {
              step.step_number = i;
              options.step(step);
            }
          }
        }
      };

      this.drawSteppedRoute = function(options) {
        if (options.origin && options.destination) {
          this.getRoutes({
            origin: options.origin,
            destination: options.destination,
            travelMode: options.travelMode,
            waypoints : options.waypoints,
            callback: function(e) {
              //start callback
              if (e.length > 0 && options.start) {
                options.start(e[e.length - 1]);
              }

              //step callback
              if (e.length > 0 && options.step) {
                var route = e[e.length - 1];
                if (route.legs.length > 0) {
                  var steps = route.legs[0].steps;
                  for (var i=0, step; step=steps[i]; i++) {
                    step.step_number = i;
                    self.drawPolyline({
                      path: step.path,
                      strokeColor: options.strokeColor,
                      strokeOpacity: options.strokeOpacity,
                      strokeWeight: options.strokeWeight
                    });
                    options.step(step, (route.legs[0].steps.length - 1));
                  }
                }
              }

              //end callback
              if (e.length > 0 && options.end) {
                 options.end(e[e.length - 1]);
              }
            }
          });
        }
        else if (options.route) {
          if (options.route.legs.length > 0) {
            var steps = options.route.legs[0].steps;
            for (var i=0, step; step=steps[i]; i++) {
              step.step_number = i;
              self.drawPolyline({
                path: step.path,
                strokeColor: options.strokeColor,
                strokeOpacity: options.strokeOpacity,
                strokeWeight: options.strokeWeight
              });
              options.step(step);
            }
          }
        }
      };

      // Geofence

      this.checkGeofence = function(lat, lng, fence) {
        return fence.containsLatLng(new google.maps.LatLng(lat, lng));
      };

      this.checkMarkerGeofence = function(marker, outside_callback) {
        if (marker.fences) {
          for (var i=0, fence; fence=marker.fences[i]; i++) {
            var pos = marker.getPosition();
            if (!self.checkGeofence(pos.lat(), pos.lng(), fence)) {
              outside_callback(marker, fence);
            }
          }
        }
      };

      // Layers

      this.addLayer = function(layerName, options) {
        //var default_layers = ['weather', 'clouds', 'traffic', 'transit', 'bicycling', 'panoramio', 'places'];
        options = options || {};
        var layer;

        switch(layerName) {
          case 'weather': this.singleLayers.weather = layer = new google.maps.weather.WeatherLayer();
            break;
          case 'clouds': this.singleLayers.clouds = layer = new google.maps.weather.CloudLayer();
            break;
          case 'traffic': this.singleLayers.traffic = layer = new google.maps.TrafficLayer();
            break;
          case 'transit': this.singleLayers.transit = layer = new google.maps.TransitLayer();
            break;
          case 'bicycling': this.singleLayers.bicycling = layer = new google.maps.BicyclingLayer();
            break;
          case 'panoramio':
              this.singleLayers.panoramio = layer = new google.maps.panoramio.PanoramioLayer();
              layer.setTag(options.filter);
              delete options.filter;

              //click event
              if(options.click) {
                google.maps.event.addListener(layer, 'click', function(event) {
                  options.click(event);
                  delete options.click;
                });
              }
            break;
            case 'places':
              this.singleLayers.places = layer = new google.maps.places.PlacesService(this.map);

              //search and  nearbySearch callback, Both are the same
              if(options.search || options.nearbySearch) {
                var placeSearchRequest  = {
                  bounds : options.bounds || null,
                  keyword : options.keyword || null,
                  location : options.location || null,
                  name : options.name || null,
                  radius : options.radius || null,
                  rankBy : options.rankBy || null,
                  types : options.types || null
                };

                if(options.search) {
                  layer.search(placeSearchRequest, options.search);
                }

                if(options.nearbySearch) {
                  layer.nearbySearch(placeSearchRequest, options.nearbySearch);
                }
              }

              //textSearch callback
              if(options.textSearch) {
                var textSearchRequest  = {
                  bounds : options.bounds || null,
                  location : options.location || null,
                  query : options.query || null,
                  radius : options.radius || null
                };

                layer.textSearch(textSearchRequest, options.textSearch);
              }
            break;
        }

        if(layer !== undefined) {
          if(typeof layer.setOptions == 'function') {
            layer.setOptions(options);
          }
          if(typeof layer.setMap == 'function') {
            layer.setMap(this.map);
          }

          return layer;
        }
      };

      this.removeLayer = function(layer) {
        if(typeof(layer) == "string" && this.singleLayers[layer] !== undefined) {
           this.singleLayers[layer].setMap(null);
           delete this.singleLayers[layer];
        }
        else {
          for(var i = 0; i < this.layers.length; i++) {
            if(this.layers[i] === layer) {
              this.layers[i].setMap(null);
              this.layers.splice(i, 1);

              break;
            }
          }
        }
      };

      // Static Maps

      this.toImage = function(options) {
        var options = options || {};
        var static_map_options = {};
        static_map_options['size'] = options['size'] || [this.el.clientWidth, this.el.clientHeight];
        static_map_options['lat'] = this.getCenter().lat();
        static_map_options['lng'] = this.getCenter().lng();

        if(this.markers.length > 0) {
          static_map_options['markers'] = [];
          for(var i=0; i < this.markers.length; i++) {
            static_map_options['markers'].push({
              lat: this.markers[i].getPosition().lat(),
              lng: this.markers[i].getPosition().lng()
            });
          }
        }

        if(this.polylines.length > 0) {
          var polyline = this.polylines[0];
          static_map_options['polyline'] = {};
          static_map_options['polyline']['path'] = google.maps.geometry.encoding.encodePath(polyline.getPath());
          static_map_options['polyline']['strokeColor'] = polyline.strokeColor
          static_map_options['polyline']['strokeOpacity'] = polyline.strokeOpacity
          static_map_options['polyline']['strokeWeight'] = polyline.strokeWeight
        }

        return GMaps.staticMapURL(static_map_options);
      };

      // Map Types

      this.addMapType = function(mapTypeId, options) {
        if(options.hasOwnProperty("getTileUrl") && typeof(options["getTileUrl"]) == "function") {
          options.tileSize = options.tileSize || new google.maps.Size(256, 256);

          var mapType = new google.maps.ImageMapType(options);

          this.map.mapTypes.set(mapTypeId, mapType);
        }
        else {
          throw "'getTileUrl' function required.";
        }
      };

      this.addOverlayMapType = function(options) {
        if(options.hasOwnProperty("getTile") && typeof(options["getTile"]) == "function") {
          var overlayMapTypeIndex = options.index;

          delete options.index;

          this.map.overlayMapTypes.insertAt(overlayMapTypeIndex, options);
        }
        else {
          throw "'getTile' function required.";
        }
      };

      this.removeOverlayMapType = function(overlayMapTypeIndex) {
        this.map.overlayMapTypes.removeAt(overlayMapTypeIndex);
      };

      // Styles

      this.addStyle = function(options) {
        var styledMapType = new google.maps.StyledMapType(options.styles, options.styledMapName);

        this.map.mapTypes.set(options.mapTypeId, styledMapType);
      };

      this.setStyle = function(mapTypeId) {
        this.map.setMapTypeId(mapTypeId);
      };

      // StreetView

      this.createPanorama = function(streetview_options) {
        if (!streetview_options.hasOwnProperty('lat') || !streetview_options.hasOwnProperty('lng')) {
          streetview_options.lat = this.getCenter().lat();
          streetview_options.lng = this.getCenter().lng();
        }

        this.panorama = GMaps.createPanorama(streetview_options);

        this.map.setStreetView(this.panorama);

        return this.panorama;
      };

      // Events

      this.on = function(event_name, handler) {
        return GMaps.on(event_name, this, handler);
      };

      this.off = function(event_name) {
        GMaps.off(event_name, this);
      };
    };

    GMaps.createPanorama = function(options) {
      var el = getElementById(options.el, options.context);

      options.position = new google.maps.LatLng(options.lat, options.lng);

      delete options.el;
      delete options.context;
      delete options.lat;
      delete options.lng;

      var streetview_events = ['closeclick', 'links_changed', 'pano_changed', 'position_changed', 'pov_changed', 'resize', 'visible_changed'];

      var streetview_options = extend_object({visible : true}, options);

      for(var i = 0; i < streetview_events.length; i++) {
        delete streetview_options[streetview_events[i]];
      }

      var panorama = new google.maps.StreetViewPanorama(el, streetview_options);

      for(var i = 0; i < streetview_events.length; i++) {
        (function(object, name) {
          if (options[name]) {
            google.maps.event.addListener(object, name, function(){
              options[name].apply(this);
            });
          }
        })(panorama, streetview_events[i]);
      }

      return panorama;
    };

    GMaps.Route = function(options) {
      this.map = options.map;
      this.route = options.route;
      this.step_count = 0;
      this.steps = this.route.legs[0].steps;
      this.steps_length = this.steps.length;

      this.polyline = this.map.drawPolyline({
        path: new google.maps.MVCArray(),
        strokeColor: options.strokeColor,
        strokeOpacity: options.strokeOpacity,
        strokeWeight: options.strokeWeight
      }).getPath();

      this.back = function() {
        if (this.step_count > 0) {
          this.step_count--;
          var path = this.route.legs[0].steps[this.step_count].path;
          for (var p in path){
            if (path.hasOwnProperty(p)){
              this.polyline.pop();
            }
          }
        }
      };

      this.forward = function() {
        if (this.step_count < this.steps_length) {
          var path = this.route.legs[0].steps[this.step_count].path;
          for (var p in path){
            if (path.hasOwnProperty(p)){
              this.polyline.push(path[p]);
            }
          }
          this.step_count++;
        }
      };
    };

    // Geolocation (Modern browsers only)

    GMaps.geolocate = function(options) {
      var complete_callback = options.always || options.complete;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          options.success(position);

          if (complete_callback) {
            complete_callback();
          }
        }, function(error) {
          options.error(error);

          if (complete_callback) {
            complete_callback();
          }
        }, options.options);
      }
      else {
        options.not_supported();

        if (complete_callback) {
          complete_callback();
        }
      }
    };

    // Geocoding

    GMaps.geocode = function(options) {
      this.geocoder = new google.maps.Geocoder();
      var callback = options.callback;
      if (options.hasOwnProperty('lat') && options.hasOwnProperty('lng')) {
        options.latLng = new google.maps.LatLng(options.lat, options.lng);
      }

      delete options.lat;
      delete options.lng;
      delete options.callback;
      this.geocoder.geocode(options, function(results, status) {
        callback(results, status);
      });
    };

    // Static maps

    GMaps.staticMapURL = function(options){
      var parameters = [];
      var data;

      var static_root = 'http://maps.googleapis.com/maps/api/staticmap';
      if (options.url){
        static_root = options.url;
        delete options.url;
      }
      static_root += '?';

      var markers = options.markers;
      delete options.markers;
      if (!markers && options.marker){
        markers = [options.marker];
        delete options.marker;
      }

      var polyline = options.polyline;
      delete options.polyline;

      /** Map options **/
      if (options.center){
        parameters.push('center=' + options.center);
        delete options.center;
      }
      else if (options.address){
        parameters.push('center=' + options.address);
        delete options.address;
      }
      else if (options.lat){
        parameters.push(['center=', options.lat, ',', options.lng].join(''));
        delete options.lat;
        delete options.lng;
      }
      else if (options.visible){
        var visible = encodeURI(options.visible.join('|'));
        parameters.push('visible=' + visible);
      }

      var size = options.size;
      if (size){
        if (size.join){
          size = size.join('x');
        }
        delete options.size;
      }
      else {
        size = '630x300';
      }
      parameters.push('size=' + size);

      if (!options.zoom){
        options.zoom = 15;
      }

      var sensor = options.hasOwnProperty('sensor') ? !!options.sensor : true;
      delete options.sensor;
      parameters.push('sensor=' + sensor);

      for (var param in options){
        if (options.hasOwnProperty(param)){
          parameters.push(param + '=' + options[param]);
        }
      }

      /** Markers **/
      if (markers){
        var marker, loc;

        for (var i=0; data=markers[i]; i++){
          marker = [];

          if (data.size && data.size !== 'normal'){
            marker.push('size:' + data.size);
          }
          else if (data.icon){
            marker.push('icon:' + encodeURI(data.icon));
          }

          if (data.color){
            marker.push('color:' + data.color.replace('#', '0x'));
          }

          if (data.label){
            marker.push('label:' + data.label[0].toUpperCase());
          }

          loc = (data.address ? data.address : data.lat + ',' + data.lng);

          if (marker.length || i === 0){
            marker.push(loc);
            marker = marker.join('|');
            parameters.push('markers=' + encodeURI(marker));
          }
          // New marker without styles
          else {
            marker = parameters.pop() + encodeURI('|' + loc);
            parameters.push(marker);
          }
        }
      }

      /** Polylines **/
      function parseColor(color, opacity){
        if (color[0] === '#'){
          color = color.replace('#', '0x');

          if (opacity){
            opacity = parseFloat(opacity);
            opacity = Math.min(1, Math.max(opacity, 0));
            if (opacity === 0){
              return '0x00000000';
            }
            opacity = (opacity * 255).toString(16);
            if (opacity.length === 1){
              opacity += opacity;
            }

            color = color.slice(0,8) + opacity;
          }
        }
        return color;
      }

      if (polyline){
        data = polyline;
        polyline = [];

        if (data.strokeWeight){
          polyline.push('weight:' + parseInt(data.strokeWeight, 10));
        }

        if (data.strokeColor){
          var color = parseColor(data.strokeColor, data.strokeOpacity);
          polyline.push('color:' + color);
        }

        if (data.fillColor){
          var fillcolor = parseColor(data.fillColor, data.fillOpacity);
          polyline.push('fillcolor:' + fillcolor);
        }

        var path = data.path;
        if (path.join){
          for (var j=0, pos; pos=path[j]; j++){
            polyline.push(pos.join(','));
          }
        }
        else {
          polyline.push('enc:' + path);
        }

        polyline = polyline.join('|');
        parameters.push('path=' + encodeURI(polyline));
      }

      parameters = parameters.join('&');
      return static_root + parameters;
    };

    // Events

    GMaps.custom_events = ['marker_added', 'marker_removed', 'polyline_added', 'polyline_removed', 'polygon_added', 'polygon_removed', 'geolocated', 'geolocation_failed'];

    GMaps.on = function(event_name, object, handler) {
      if (GMaps.custom_events.indexOf(event_name) == -1) {
        return google.maps.event.addListener(object, event_name, handler);
      }
      else {
        var registered_event = {
          handler : handler,
          eventName : event_name
        };

        object.registered_events[event_name] = object.registered_events[event_name] || [];
        object.registered_events[event_name].push(registered_event);

        return registered_event;
      }
    };

    GMaps.off = function(event_name, object) {
      if (GMaps.custom_events.indexOf(event_name) == -1) {
        google.maps.event.clearListeners(object, event_name);
      }
      else {
        object.registered_events[event_name] = [];
      }
    };

    GMaps.fire = function(event_name, object, scope) {
      if (GMaps.custom_events.indexOf(event_name) == -1) {
        google.maps.event.trigger(object, event_name, Array.prototype.slice.apply(arguments).slice(2));
      }
      else {
        if(event_name in scope.registered_events) {
          var firing_events = scope.registered_events[event_name];

          for(var i = 0; i < firing_events.length; i++) {
            (function(handler, scope, object) {
              handler.apply(scope, [object]);
            })(firing_events[i]['handler'], scope, object);
          }
        }
      }
    };

    //==========================
    // Polygon containsLatLng
    // https://github.com/tparkin/Google-Maps-Point-in-Polygon
    // Poygon getBounds extension - google-maps-extensions
    // http://code.google.com/p/google-maps-extensions/source/browse/google.maps.Polygon.getBounds.js
    if (!google.maps.Polygon.prototype.getBounds) {
      google.maps.Polygon.prototype.getBounds = function(latLng) {
        var bounds = new google.maps.LatLngBounds();
        var paths = this.getPaths();
        var path;

        for (var p = 0; p < paths.getLength(); p++) {
          path = paths.getAt(p);
          for (var i = 0; i < path.getLength(); i++) {
            bounds.extend(path.getAt(i));
          }
        }

        return bounds;
      };
    }

    if (!google.maps.Polygon.prototype.containsLatLng) {
      // Polygon containsLatLng - method to determine if a latLng is within a polygon
      google.maps.Polygon.prototype.containsLatLng = function(latLng) {
        // Exclude points outside of bounds as there is no way they are in the poly
        var bounds = this.getBounds();

        if (bounds !== null && !bounds.contains(latLng)) {
          return false;
        }

        // Raycast point in polygon method
        var inPoly = false;

        var numPaths = this.getPaths().getLength();
        for (var p = 0; p < numPaths; p++) {
          var path = this.getPaths().getAt(p);
          var numPoints = path.getLength();
          var j = numPoints - 1;

          for (var i = 0; i < numPoints; i++) {
            var vertex1 = path.getAt(i);
            var vertex2 = path.getAt(j);

            if (vertex1.lng() < latLng.lng() && vertex2.lng() >= latLng.lng() || vertex2.lng() < latLng.lng() && vertex1.lng() >= latLng.lng()) {
              if (vertex1.lat() + (latLng.lng() - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < latLng.lat()) {
                inPoly = !inPoly;
              }
            }

            j = i;
          }
        }

        return inPoly;
      };
    }

    google.maps.LatLngBounds.prototype.containsLatLng = function(latLng) {
      return this.contains(latLng);
    };

    google.maps.Marker.prototype.setFences = function(fences) {
      this.fences = fences;
    };

    google.maps.Marker.prototype.addFence = function(fence) {
      this.fences.push(fence);
    };

    return GMaps;
  }(this));

  var coordsToLatLngs = function(coords, useGeoJSON) {
    var first_coord = coords[0];
    var second_coord = coords[1];

    if(useGeoJSON) {
      first_coord = coords[1];
      second_coord = coords[0];
    }

    return new google.maps.LatLng(first_coord, second_coord);
  };

  var arrayToLatLng = function(coords, useGeoJSON) {
    for(var i=0; i < coords.length; i++) {
      if(coords[i].length > 0 && typeof(coords[i][0]) != "number") {
        coords[i] = arrayToLatLng(coords[i], useGeoJSON);
      }
      else {
        coords[i] = coordsToLatLngs(coords[i], useGeoJSON);
      }
    }

    return coords;
  };

  var extend_object = function(obj, new_obj) {
    if(obj === new_obj) return obj;

    for(var name in new_obj) {
      obj[name] = new_obj[name];
    }

    return obj;
  };

  var replace_object = function(obj, replace) {
    if(obj === replace) return obj;

    for(var name in replace) {
      if(obj[name] != undefined)
        obj[name] = replace[name];
    }

    return obj;
  };

  var array_map = function(array, callback) {
    var original_callback_params = Array.prototype.slice.call(arguments, 2);

    if (Array.prototype.map && array.map === Array.prototype.map) {
      return Array.prototype.map.call(array, function(item) {
        callback_params = original_callback_params;
        callback_params.splice(0, 0, item);

        return callback.apply(this, callback_params);
      });
    }
    else {
      var array_return = [];
      var array_length = array.length;

      for(var i = 0; i < array_length; i++) {
        callback_params = original_callback_params;
        callback_params = callback_params.splice(0, 0, array[i]);
        array_return.push(callback.apply(this, callback_params));
      }

      return array_return;
    }
  };

  var array_flat = function(array) {
    new_array = [];

    for(var i=0; i < array.length; i++) {
      new_array = new_array.concat(array[i]);
    }

    return new_array;
  };
}

else {
  throw 'Google Maps API is required. Please register the following JavaScript library http://maps.google.com/maps/api/js?sensor=true.'
}