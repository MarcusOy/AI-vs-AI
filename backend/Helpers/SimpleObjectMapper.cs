// Taken from https://www.twilio.com/blog/building-blazing-fast-object-mapper-c-sharp-net-core
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Snappy.API.Helpers
{
    public class SimpleObjectMapper : ObjectCopyBase
    {
        private readonly Dictionary<string, PropertyMap[]> _maps = new Dictionary<string, PropertyMap[]>();

        public override void MapTypes(Type source, Type target)
        {
            var key = GetMapKey(source, target);
            if (_maps.ContainsKey(key))
            {
                return;
            }

            var props = GetMatchingProperties(source, target);
            _maps.Add(key, props.ToArray());
        }

        public override void Copy(object source, object target)
        {
            var sourceType = source.GetType();
            var targetType = target.GetType();

            var key = GetMapKey(sourceType, targetType);
            if (!_maps.ContainsKey(key))
            {
                MapTypes(sourceType, targetType);
            }

            var propMap = _maps[key];

            for (var i = 0; i < propMap.Length; i++)
            {
                var prop = propMap[i];
                var sourceValue = prop.SourceProperty.GetValue(source, null);
                prop.TargetProperty.SetValue(target, sourceValue, null);
            }
        }
        public T Cast<T>(object source) where T : class, new()

        {
            var newObj = new T();
            this.Copy(source, newObj);
            return newObj;
        }
    }
    public abstract class ObjectCopyBase
    {

        public abstract void MapTypes(Type source, Type target);
        public abstract void Copy(object source, object target);

        protected virtual IList<PropertyMap> GetMatchingProperties
            (Type sourceType, Type targetType)
        {
            var sourceProperties = sourceType.GetProperties();
            var targetProperties = targetType.GetProperties();

            var properties = (from s in sourceProperties
                              from t in targetProperties
                              where s.Name == t.Name &&
                                    s.CanRead &&
                                    t.CanWrite &&
                                    s.PropertyType == t.PropertyType
                              select new PropertyMap
                              {
                                  SourceProperty = s,
                                  TargetProperty = t
                              }).ToList();
            return properties;
        }

        protected virtual string GetMapKey(Type sourceType, Type targetType)
        {
            var keyName = "Copy_";
            keyName += sourceType.FullName.Replace(".", "_").Replace("+", "_");
            keyName += "_";
            keyName += targetType.FullName.Replace(".", "_").Replace("+", "_");

            return keyName;
        }
    }

    public class PropertyMap
    {
        public PropertyInfo SourceProperty { get; set; }
        public PropertyInfo TargetProperty { get; set; }
    }
}
