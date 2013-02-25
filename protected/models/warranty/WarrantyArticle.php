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
 */
class WarrantyArticle extends FActiveRecord
{
  /**
   * @return array
   */
  public function defaultScope()
  {
    return [
      'condition' => '`visible` = 1',
    ];
  }
}