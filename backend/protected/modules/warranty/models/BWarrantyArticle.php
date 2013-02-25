<?php
/**
 * @author Nikita Melnikov <melnikov@shogo.ru>
 * @link https://github.com/shogodev/argilla/
 * @copyright Copyright &copy; 2003-2013 Shogo
 * @license http://argilla.ru/LICENSE
 *
 * @property int $id
 * @property string $name
 * @property string $notice
 * @property string $content
 * @property int $visible
 *
 * @method static BWarrantyArticle model(string $class = __CLASS__)
 */
class BWarrantyArticle extends BActiveRecord
{
  /**
   * @return array
   */
  public function rules()
  {
    return [
      ['name', 'required'],
      ['name', 'length', 'max' => 255],
      ['visible', 'numerical', 'integerOnly' => true],
      ['notice, content', 'safe']
    ];
  }

  public function search()
  {
    $criteria = new CDbCriteria();

    $criteria->compare('name', $this->name, true);
    $criteria->compare('visible', $this->visible);

    return new BActiveDataProvider($this, [
      'criteria' => $criteria,
    ]);
  }
}