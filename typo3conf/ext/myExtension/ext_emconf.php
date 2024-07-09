<?php

/***************************************************************
 * myExtension
 * RKropp
 ***************************************************************/

$EM_CONF[$_EXTKEY] = array(
    'title' => 'myExtension',
    'description' => 'myExtension',
    'category' => 'templates',
    'version' => '1.0.0',
    'state' => 'stable',
    'uploadfolder' => false,
    'clearcacheonload' => false,
    'author' => 'Raphael Kropp',
    'author_email' => 's4rakrop@uni-trier.de',
    'author_company' => 'private',
    'constraints' =>
        array(
            'depends' =>
                array(
                    'typo3' => '11.5.0-12.4.99'
                ),
            'conflicts' =>
                array(),
            'suggests' =>
                array(),
        ),
);

