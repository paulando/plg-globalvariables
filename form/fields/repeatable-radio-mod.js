/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


String.prototype.matchAll = function (regexp) {
    var matches = [];
    this.replace(regexp, function () {
        var arr = ([]).slice.call(arguments, 0);
        var extras = arr.splice(-2);
        arr.index = extras[0];
        arr.input = extras[1];
        matches.push(arr);
    });
    return matches.length ? matches : null;
};

function getVarNameId(i) {
    return "#jform_params__direct_variable_input_dummy__direct_variable_input_dummy"+i+"__varname";
}

function getVarValueId(i) {
    return "#jform_params__direct_variable_input_dummy__direct_variable_input_dummy"+i+"__varvalue";
}

function generateJson($fields_input) {
    setTimeout(() => {
        const $dummy_fields_container = jQuery(".subform-repeatable-container");
        const fields_count = $dummy_fields_container.find("> tr").length;

        const var_names  = [];
        const var_values = [];

        for (let index = 0; index < fields_count; index++) {
            const var_name = jQuery(getVarNameId(index)).val();
            const var_value = jQuery(getVarValueId(index)).val();

            if (var_name !== "" && var_value !== "") {
                console.log(var_name)
                var_names.push(var_name);
                var_values.push(var_value);
            }
        }

        $fields_input.val(JSON.stringify({
            varname: var_names.filter(item => typeof item === "string"),
            varvalue: var_values.filter(item => typeof item === "string"),
        }));
    }, 1000)
}

window.addEventListener("load", function() {
    const $fields_input = jQuery("#jform_params_direct_variable_input");
    
    if ($fields_input.val() !== "") {
        const fields = JSON.parse($fields_input.val());
        fields.varname.forEach((name,i) => {
            jQuery(getVarNameId(i)).val(name);
        });
    
        fields.varvalue.forEach((value,i) => {
            jQuery(getVarValueId(i)).val(value);
        });
    }

    jQuery("body").on("click", ".subform-repeatable-container .group-add", function() {
        generateJson($fields_input);
    });

    jQuery("body").find(".subform-repeatable-container .group-remove").on("click", function() {
        generateJson($fields_input);
    });

    jQuery("body").on("keyup blur", ".subform-repeatable-container input, .subform-repeatable-container textarea", function() {
        generateJson($fields_input);
    });
});
