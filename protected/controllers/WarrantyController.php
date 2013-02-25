<?php
/**
 * @author Nikita Melnikov <melnikov@shogo.ru>
 * @link https://github.com/shogodev/argilla/
 * @copyright Copyright &copy; 2003-2013 Shogo
 * @license http://argilla.ru/LICENSE
 */

Yii::import('frontend.models.warranty.*');

class WarrantyController extends FController
{
  public function actionIndex()
  {
    $articles = WarrantyArticle::model()->findAll();

    return $this->render('index', ['articles' => $articles]);
  }

  public function actionArticle($id)
  {
    $article = WarrantyArticle::model()->findByPk($id);

    if( $article === null )
      throw new CHttpException(404);

    $this->render('article', ['article' => $article]);
  }
}