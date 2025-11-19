using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EmployeeCrudApi.Models
{
    public class Employee
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("createdDate")]
        public DateTime CreatedDate { get; set; }
    }
}
