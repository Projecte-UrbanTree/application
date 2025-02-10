<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'El camp :attribute ha de ser acceptat.',
    'active_url' => 'El camp :attribute no és una URL vàlida.',
    'after' => 'El camp :attribute ha de ser una data posterior a :date.',
    'after_or_equal' => 'El camp :attribute ha de ser una data posterior o igual a :date.',
    'alpha' => 'El camp :attribute només pot contenir lletres.',
    'alpha_dash' => 'El camp :attribute només pot contenir lletres, números, guions i guions baixos.',
    'alpha_num' => 'El camp :attribute només pot contenir lletres i números.',
    'array' => 'El camp :attribute ha de ser una matriu.',
    'before' => 'El camp :attribute ha de ser una data anterior a :date.',
    'before_or_equal' => 'El camp :attribute ha de ser una data anterior o igual a :date.',
    'between' => [
        'numeric' => 'El camp :attribute ha de ser un valor entre :min i :max.',
        'file' => 'El fitxer :attribute ha de pesar entre :min i :max kilobytes.',
        'string' => 'El camp :attribute ha de contenir entre :min i :max caràcters.',
        'array' => 'El camp :attribute ha de contenir entre :min i :max elements.',
    ],
    'boolean' => 'El camp :attribute ha de ser verdader o fals.',
    'confirmed' => 'El camp confirmació de :attribute no coincideix.',
    'date' => 'El camp :attribute no correspon amb una data vàlida.',
    'date_equals' => 'El camp :attribute ha de ser una data igual a :date.',
    'date_format' => 'El camp :attribute no correspon amb el format de data :format.',
    'different' => 'Els camps :attribute i :other han de ser diferents.',
    'digits' => 'El camp :attribute ha de ser un número de :digits dígits.',
    'digits_between' => 'El camp :attribute ha de contenir entre :min i :max dígits.',
    'dimensions' => 'El camp :attribute té dimensions d\'imatge invàlides.',
    'distinct' => 'El camp :attribute té un valor duplicat.',
    'email' => 'El camp :attribute ha de ser una adreça de correu vàlida.',
    'ends_with' => 'El camp :attribute ha d\'acabar amb un dels següents valors: :values',
    'exists' => 'El camp :attribute seleccionat no existeix.',
    'file' => 'El camp :attribute ha de ser un fitxer.',
    'filled' => 'El camp :attribute ha de tenir un valor.',
    'gt' => [
        'numeric' => 'El camp :attribute ha de ser més gran que :value.',
        'file' => 'El fitxer :attribute ha de pesar més de :value kilobytes.',
        'string' => 'El camp :attribute ha de contenir més de :value caràcters.',
        'array' => 'El camp :attribute ha de contenir més de :value elements.',
    ],
    'gte' => [
        'numeric' => 'El camp :attribute ha de ser més gran o igual a :value.',
        'file' => 'El fitxer :attribute ha de pesar :value o més kilobytes.',
        'string' => 'El camp :attribute ha de contenir :value o més caràcters.',
        'array' => 'El camp :attribute ha de contenir :value o més elements.',
    ],
    'image' => 'El camp :attribute ha de ser una imatge.',
    'in' => 'El camp :attribute és invàlid.',
    'in_array' => 'El camp :attribute no existeix a :other.',
    'integer' => 'El camp :attribute ha de ser un número enter.',
    'ip' => 'El camp :attribute ha de ser una adreça IP vàlida.',
    'ipv4' => 'El camp :attribute ha de ser una adreça IPv4 vàlida.',
    'ipv6' => 'El camp :attribute ha de ser una adreça IPv6 vàlida.',
    'json' => 'El camp :attribute ha de ser una cadena de text JSON vàlida.',
    'lt' => [
        'numeric' => 'El camp :attribute ha de ser més petit que :value.',
        'file' => 'El fitxer :attribute ha de pesar menys de :value kilobytes.',
        'string' => 'El camp :attribute ha de contenir menys de :value caràcters.',
        'array' => 'El camp :attribute ha de contenir menys de :value elements.',
    ],
    'lte' => [
        'numeric' => 'El camp :attribute ha de ser més petit o igual a :value.',
        'file' => 'El fitxer :attribute ha de pesar :value o menys kilobytes.',
        'string' => 'El camp :attribute ha de contenir :value o menys caràcters.',
        'array' => 'El camp :attribute ha de contenir :value o menys elements.',
    ],
    'max' => [
        'numeric' => 'El camp :attribute no ha de ser més gran que :max.',
        'file' => 'El fitxer :attribute no ha de pesar més de :max kilobytes.',
        'string' => 'El camp :attribute no ha de contenir més de :max caràcters.',
        'array' => 'El camp :attribute no ha de contenir més de :max elements.',
    ],
    'mimes' => 'El camp :attribute ha de ser un fitxer de tipus: :values.',
    'mimetypes' => 'El camp :attribute ha de ser un fitxer de tipus: :values.',
    'min' => [
        'numeric' => 'El camp :attribute ha de ser almenys :min.',
        'file' => 'El fitxer :attribute ha de pesar almenys :min kilobytes.',
        'string' => 'El camp :attribute ha de contenir almenys :min caràcters.',
        'array' => 'El camp :attribute ha de contenir almenys :min elements.',
    ],
    'not_in' => 'El camp :attribute seleccionat és invàlid.',
    'not_regex' => 'El format del camp :attribute és invàlid.',
    'numeric' => 'El camp :attribute ha de ser un número.',
    'password' => 'La contrasenya és incorrecta.',
    'present' => 'El camp :attribute ha d\'estar present.',
    'regex' => 'El format del camp :attribute és invàlid.',
    'required' => 'El camp :attribute és obligatori.',
    'required_if' => 'El camp :attribute és obligatori quan el camp :other és :value.',
    'required_unless' => 'El camp :attribute és obligatori a menys que :other es trobi en :values.',
    'required_with' => 'El camp :attribute és obligatori quan :values està present.',
    'required_with_all' => 'El camp :attribute és obligatori quan :values estan presents.',
    'required_without' => 'El camp :attribute és obligatori quan :values no està present.',
    'required_without_all' => 'El camp :attribute és obligatori quan cap dels camps :values estan presents.',
    'same' => 'Els camps :attribute i :other han de coincidir.',
    'size' => [
        'numeric' => 'El camp :attribute ha de ser :size.',
        'file' => 'El fitxer :attribute ha de pesar :size kilobytes.',
        'string' => 'El camp :attribute ha de contenir :size caràcters.',
        'array' => 'El camp :attribute ha de contenir :size elements.',
    ],
    'starts_with' => 'El camp :attribute ha de començar amb un dels següents valors: :values',
    'string' => 'El camp :attribute ha de ser una cadena de caràcters.',
    'timezone' => 'El camp :attribute ha de ser una zona horària vàlida.',
    'unique' => 'El valor del camp :attribute ja està en ús.',
    'uploaded' => 'El camp :attribute no s\'ha pogut pujar.',
    'url' => 'El format del camp :attribute és invàlid.',
    'uuid' => 'El camp :attribute ha de ser un UUID vàlid.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap attribute place-holders
    | with something more reader friendly such as E-Mail Address instead
    | of "email". This simply helps us make messages a little cleaner.
    |
    */

    'attributes' => [],

];
