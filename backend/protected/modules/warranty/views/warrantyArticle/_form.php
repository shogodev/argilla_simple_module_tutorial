<?php

Yii::app()->breadcrumbs->show(); // испорльзуется для отображения хлебных крошек

$form = $this->beginWidget('BActiveForm', array('id' => $model->getFormId()));
$this->renderPartial('//_form_buttons', array('model' => $model));
echo $form->errorSummary($model);
echo $form->renderRequire();
?>

  <table class="detail-view table table-striped table-bordered">
    <tbody>
    <?php echo $form->textFieldRow($model, 'name');?>

    <?php echo $form->textAreaRow($model, 'notice');?>
    <?php echo $form->textAreaRow($model, 'content');?>

    <?php echo $form->checkBoxRow($model, 'visible');?>
    </tbody>

  </table>

<?php
$this->renderPartial('//_form_buttons', array('model' => $model));
$this->endWidget();