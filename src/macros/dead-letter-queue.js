module.exports = function dlq(arc, cfn) {
  
  // walk the resources
  for (let resource of Object.keys(cfn.Resources)) {

    // only care about queues and do not want to self reference dlq
    if (resource != 'DlqQueue' && cfn.Resources[resource].Type === 'AWS::SQS::Queue') {

      // set the redrive to point to our dlq
      cfn.Resources[resource].Properties.RedrivePolicy = {
        deadLetterTargetArn: {'Fn::GetAtt': [`DlqQueue`, 'Arn']},
        maxReceiveCount: 1
      } 
    }
  }

  return cfn
}
